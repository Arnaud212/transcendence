from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, get_user_model, logout
from django.contrib import messages
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from allauth.account.views import ConfirmEmailView
from allauth.account.utils import send_email_confirmation
from .forms import LoginForm, CustomUserCreationForm, CustomPasswordChangeForm, ProfilePictureForm
from django.views.decorators.http import require_POST
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
import json
from rest_framework_simplejwt.tokens import RefreshToken
from two_factor.views import LoginView, SetupView
from django.contrib.auth.decorators import login_required
from django_otp.plugins.otp_totp.models import TOTPDevice
from django_otp.decorators import otp_required
import qrcode
from io import BytesIO
import logging
from django.utils.timezone import now
import secrets
import uuid
from django.contrib.auth.hashers import check_password
import requests
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import get_backends
from urllib.parse import urlencode
from .models import CustomUser, Friend, GameHistory
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from django.db import models

logger = logging.getLogger(__name__)

CustomUser = get_user_model()

def index(request):
    context = {
        'timestamp': int(now().timestamp()),
    }
    return render(request, 'index.html', context)

class CustomLoginView(LoginView):
    def form_valid(self, form):
        if self.request.user.is_verified():
            return super().form_valid(form)
        else:
            return redirect('two_factor:setup')

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if not user.emailaddress_set.filter(verified=True).exists():
                send_email_confirmation(request, user)
                return JsonResponse({'status': 'error', 'message': 'Email not verified. Please check your email.'})
            otp = generate_otp(user)
            send_otp_email(user.email, otp)
            request.session['otp'] = otp
            request.session['username'] = username
            request.session['logged_in'] = True
            refresh = RefreshToken.for_user(user)
            return JsonResponse({'status': 'otp_required', 'access': str(refresh.access_token), 'refresh': str(refresh), 'message': 'OTP required. Please check your email.'})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid username or password'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

def generate_otp(user):
    import random
    return str(random.randint(100000, 999999))

def send_otp_email(email, otp):
    send_mail(
        'Your OTP Code',
        f'Your OTP code is {otp}',
        'jochum.floriane@gmail.com',
        [email],
        fail_silently=False,
    )

@csrf_exempt
def verify_otp_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        otp = data.get('otp')
        session_otp = request.session.get('otp')
        username = request.session.get('username')
        if otp == session_otp:
            user = CustomUser.objects.get(username=username)
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            del request.session['otp']
            del request.session['username']
            # Set user status to online
            user.status = 'online'
            user.save()
            request.session['logged_in'] = True
            refresh = RefreshToken.for_user(user)
            return JsonResponse({'status': 'success', 'access': str(refresh.access_token), 'refresh': str(refresh)})
        else:
            return JsonResponse({'status': 'error', 'message': 'Invalid OTP'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

@csrf_exempt
def register_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        form = CustomUserCreationForm(data)
        if form.is_valid():
            user = form.save()
            send_email_confirmation(request, user)
            refresh = RefreshToken.for_user(user)
            return JsonResponse({'status': 'success', 'access': str(refresh.access_token), 'refresh': str(refresh)})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        user = request.user
        user.status = 'offline'
        user.save()
        request.session['logged_in'] = False
        request.session.flush()  # Clear all session data
        logout(request)
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

class CustomConfirmEmailView(ConfirmEmailView):
    def get_success_url(self):
        return reverse('index')

@login_required
def setup_two_factor(request):
    return redirect('two_factor:setup')

@login_required
def get_profile_data(request):
    user = request.user
    profile_data = {
        'first_name': user.first_name,
        'last_name': user.last_name,
        'username': user.username,
        'email': user.email,
        'default_language' : user.default_language,
        'profile_picture': user.profile_picture.url if user.profile_picture else '',
    }
    return JsonResponse({'status': 'success', 'profile_data': profile_data})

@login_required
@csrf_exempt
def update_profile(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = request.user

        if CustomUser.objects.filter(username=data.get('username')).exclude(id=user.id).exists():
            return JsonResponse({'status': 'error', 'message': 'Username already taken'})

        user.first_name = data.get('first_name')
        user.last_name = data.get('last_name')
        user.username = data.get('username')

        user.save()
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

@login_required
@require_POST
def update_language(request):
    user = request.user
    data = json.loads(request.body)
    new_language = data.get('default_language')

    print(data)
    print(new_language)

    if new_language:
        user.default_language = new_language
        user.save()
        return JsonResponse({'status': 'success', 'message': 'Language updated successfully'})
    else:
        return JsonResponse({'status': 'error', 'message': 'No language provided'})

@login_required
def upload_profile_picture(request):
    if request.method == 'POST':
        form = ProfilePictureForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success', 'profile_picture': request.user.profile_picture.url})
        else:
            return JsonResponse({'status': 'error', 'errors': form.errors})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

@login_required
@csrf_exempt
def check_username(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        if CustomUser.objects.filter(username=username).exists():
            return JsonResponse({'status': 'error', 'field': 'username'})
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

@login_required
@csrf_exempt
def check_email(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        if CustomUser.objects.filter(email=email).exists():
            return JsonResponse({'status': 'error', 'field': 'email'})
        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

@login_required
@csrf_exempt
def send_confirmation_email(request):
    logger.debug('send_confirmation_email called')
    user = request.user
    data = json.loads(request.body)
    new_email = data.get('email')
    logger.debug(f'New email: {new_email}')

    if CustomUser.objects.filter(email=new_email).exists():
        return JsonResponse({'status': 'error', 'message': 'Email already in use'})

    token = str(uuid.uuid4())
    request.session['email_confirmation_token'] = token
    request.session['new_email'] = new_email
    request.session.modified = True  # Ensure session is saved

    logger.debug(f'Session keys: {request.session.keys()}')
    logger.debug(f'Session token set: {request.session.get("email_confirmation_token")}')
    logger.debug(f'New email set: {request.session.get("new_email")}')

    confirmation_link = request.build_absolute_uri(reverse('confirm-email-change')) + f'?token={token}'
    logger.debug(f'Confirmation link: {confirmation_link}')

    send_mail(
        'Confirm your new email address',
        f'Please confirm your new email address by clicking the following link: {confirmation_link}',
        'jochum.floriane@gmail.com',
        [new_email],
        fail_silently=False,
    )
    return JsonResponse({'status': 'success'})

@login_required
def confirm_email_change(request):
    logger.debug('confirm_email_change called')
    token = request.GET.get('token')
    session_token = request.session.get('email_confirmation_token')
    new_email = request.session.get('new_email')

    logger.debug(f'Received token: {token}')
    logger.debug(f'Session token: {session_token}')
    logger.debug(f'New email from session: {new_email}')

    if token and token == session_token:
        user = request.user
        user.email = new_email
        user.save()
        del request.session['new_email']
        del request.session['email_confirmation_token']
        logger.debug('Email updated successfully')
        return JsonResponse({'status': 'success'})
    logger.debug('Invalid token')
    return JsonResponse({'status': 'error', 'message': 'Invalid token'})

@login_required
@csrf_exempt
def change_password(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        form = CustomPasswordChangeForm(data)

        if form.is_valid():
            current_password = form.cleaned_data.get('current_password')
            new_password1 = form.cleaned_data.get('new_password1')

            user = request.user

            if not check_password(current_password, user.password):
                return JsonResponse({'status': 'error', 'message': 'Current password is incorrect'})

            user.set_password(new_password1)
            user.save()
            return JsonResponse({'status': 'success'})
        else:
            errors = {field: error[0] for field, error in form.errors.items()}
            return JsonResponse({'status': 'error', 'errors': errors})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

@login_required
@csrf_exempt
def delete_account(request):
    user = request.user
    user.delete()
    return JsonResponse({'status': 'success', 'message': 'Your account has been permanently deleted.'})

@login_required
@csrf_exempt
def anonymize_user(request):
    user = request.user
    user.username = f'anonymous_{uuid.uuid4()}'
    user.email = f'anonymous_{uuid.uuid4()}@example.com'
    user.first_name = 'Anonymous'
    user.last_name = 'User'
    user.save()
    return JsonResponse({'status': 'success', 'message': 'Your data has been anonymized.'})

#OAuth 42 views
def oauth_42_login(request):
    client_id = settings.SOCIAL_AUTH_42_KEY
    redirect_uri = settings.SOCIAL_AUTH_42_REDIRECT_URI
    scope = 'public'
    state = secrets.token_urlsafe(16)  # Generate a secure random state string
    auth_url = f'https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code&scope={scope}&state={state}'
    return redirect(auth_url)


def oauth_42_callback(request):
    code = request.GET.get('code')
    state = request.GET.get('state')
    token_url = 'https://api.intra.42.fr/oauth/token'
    client_id = settings.SOCIAL_AUTH_42_KEY
    client_secret = settings.SOCIAL_AUTH_42_SECRET
    redirect_uri = settings.SOCIAL_AUTH_42_REDIRECT_URI

    token_data = {
        'grant_type': 'authorization_code',
        'client_id': client_id,
        'client_secret': client_secret,
        'code': code,
        'redirect_uri': redirect_uri,
    }

    token_response = requests.post(token_url, data=token_data)
    token_json = token_response.json()
    access_token = token_json.get('access_token')

    profile_url = 'https://api.intra.42.fr/v2/me'
    headers = {'Authorization': f'Bearer {access_token}'}
    profile_response = requests.get(profile_url, headers=headers)
    profile_json = profile_response.json()

    # Extract user data
    username = profile_json.get('login')
    email = profile_json.get('email')
    first_name = profile_json.get('first_name')
    last_name = profile_json.get('last_name')

    # Check if the user already exists with the OAuth ID
    user = CustomUser.objects.filter(email=email).first()
    if not user:
        # Handle username conflicts
        if CustomUser.objects.filter(username=username).exists():
            username = f"{username}_{uuid.uuid4().hex[:6]}"

        # Create a new user
        user = CustomUser.objects.create(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
        )

    # Log in the user
    login(request, user, backend='django.contrib.auth.backends.ModelBackend')

    # Set user status to online
    user.status = 'online'
    user.save()

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    # Set session variable indicating successful login
    request.session['logged_in'] = True

    # Redirect to the main page with JWT tokens as query parameters
    query_params = urlencode({
        'status': 'success',
        'access': access_token,
        'refresh': str(refresh),
        'username': user.username,
    })
    return HttpResponseRedirect(f"/?{query_params}")


def session_status(request):
    is_logged_in = request.user.is_authenticated and request.session.get('logged_in', False)
    return JsonResponse({'logged_in': is_logged_in})

@login_required
@csrf_exempt
def add_friend(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')

        if username == request.user.username:
            return JsonResponse({'status': 'error', 'message': 'You cannot add yourself as a friend'})

        try:
            friend = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found'})

        user = request.user
        if Friend.objects.filter(user=user, friend=friend).exists():
            return JsonResponse({'status': 'error', 'message': 'Friend already added'})

        Friend.objects.create(user=user, friend=friend)
        return JsonResponse({'status': 'success', 'message': 'Friend added'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


@login_required
@csrf_exempt
def delete_friend(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        friend_id = data.get('friend_id')

        try:
            friend = Friend.objects.get(id=friend_id, user=request.user)
            friend.delete()
            return JsonResponse({'status': 'success', 'message': 'Friend removed'})
        except Friend.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Friend not found'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


@login_required
def get_friends(request):
    user = request.user
    friends = Friend.objects.filter(user=user).select_related('friend')
    friends_data = [
        {'id': friend.id, 'name': friend.friend.username, 'status': friend.friend.status}
        for friend in friends
    ]
    return JsonResponse({'status': 'success', 'friends': friends_data})

@login_required
def friend_profile(request, friend_id):
    user = request.user
    friend = get_object_or_404(Friend, user=user, id=friend_id).friend

    # Calculate wins and losses
    wins = GameHistory.objects.filter(winner=friend).count()
    losses = GameHistory.objects.filter(models.Q(player1=friend) | models.Q(player2=friend)).exclude(winner=friend).count()

    friend_profile = {
        'username': friend.username,
        'wins': wins,
        'losses': losses,
    }
    return JsonResponse({'status': 'success', 'friend_profile': friend_profile})


@receiver(user_logged_in)
def user_logged_in_handler(sender, request, user, **kwargs):
    user.status = 'online'
    user.save()

@receiver(user_logged_out)
def user_logged_out_handler(sender, request, user, **kwargs):
    user.status = 'offline'
    user.save()

@csrf_exempt
@login_required
def record_game(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        player1_username = data.get('player1')
        player2_username = data.get('player2')
        winner_username = data.get('winner')
        score = data.get('score')
        date_played = now()

        print(data)

        try:
            player1 = CustomUser.objects.get(username=player1_username)
        except CustomUser.DoesNotExist:
            player1 = None

        try:
            player2 = CustomUser.objects.get(username=player2_username)
        except CustomUser.DoesNotExist:
            player2 = None

        try:
            winner = CustomUser.objects.get(username=winner_username)
        except CustomUser.DoesNotExist:
            winner = None

        GameHistory.objects.create(
            player1=player1,
            player1_username=player1_username if player1 is None else None,
            player2=player2,
            player2_username=player2_username if player2 is None else None,
            winner=winner,
            winner_username=winner_username if winner is None else None,
            score=score,
            date_played=date_played
        )

        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


@login_required
def get_game_history(request):
    user = request.user
    games = GameHistory.objects.filter(models.Q(player1=user) | models.Q(player2=user)).order_by('-date_played')
    games_data = [
        {
            'date': game.date_played.strftime("%Y-%m-%d %H:%M:%S"),
            'opponent': game.player2.username if game.player1 == user and game.player2 else game.player2_username,
            'result': 'Win' if game.winner == user else 'Loss',
            'score': game.score
        } if game.player1 == user else
        {
            'date': game.date_played.strftime("%Y-%m-%d %H:%M:%S"),
            'opponent': game.player1.username if game.player2 == user and game.player1 else game.player1_username,
            'result': 'Win' if game.winner == user else 'Loss',
            'score': game.score
        }
        for game in games
    ]
    return JsonResponse({'status': 'success', 'games': games_data})

