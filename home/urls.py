from django.urls import path, include
from .views import index, login_view, register_view, CustomConfirmEmailView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from two_factor.urls import urlpatterns as tf_urls
from . import views
from .views import login_view, register_view, logout_view, CustomConfirmEmailView, verify_otp_view, get_profile_data, update_profile
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', index, name='index'),
    path('', include(tf_urls)),
    path('login/', login_view, name='login'),
    path('register/', register_view, name='register'),
    path('accounts/confirm-email/<str:key>/', CustomConfirmEmailView.as_view(), name='account_confirm_email'),
    path('logout/', views.logout_view, name='logout'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('verify-otp/', verify_otp_view, name='verify_otp'),
    path('get-profile-data/', get_profile_data, name='get_profile_data'),
    path('update-profile/', update_profile, name='update_profile'),
    path('check-username/', views.check_username, name='check_username'),
    path('check-email/', views.check_email, name='check_email'),
    path('send-confirmation-email/', views.send_confirmation_email, name='send_confirmation_email'),
    path('confirm-email-change/', views.confirm_email_change, name='confirm-email-change'),
    path('change-password/', views.change_password, name='change_password'),
    path('anonymize-user/', views.anonymize_user, name='anonymize_user'),
    path('delete-account/', views.delete_account, name='delete_account'),
    path('upload-profile-picture/', views.upload_profile_picture, name='upload_profile_picture'),
    path('oauth/42/login/', views.oauth_42_login, name='oauth_42_login'),
    path('oauth/42/callback/', views.oauth_42_callback, name='oauth_42_callback'),
    path('session-status/', views.session_status, name='session_status'),
    path('add-friend/', views.add_friend, name='add_friend'),
    path('get-friends/', views.get_friends, name='get_friends'),
    path('friend-profile/<int:friend_id>/', views.friend_profile, name='friend_profile'),
    path('delete-friend/', views.delete_friend, name='delete_friend'),
    path('record-game/', views.record_game, name='record_game'),
    path('get-game-history/', views.get_game_history, name='get_game_history'),
    path('update-language/', views.update_language, name="update_language")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
