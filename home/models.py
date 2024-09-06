from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from django.conf import settings
import uuid

class CustomUser(AbstractUser):
    email_verified = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    original_username_42 = models.CharField(max_length=30, null=True)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    status = models.CharField(max_length=10, default='offline')
    default_language = models.CharField(max_length=10, choices=[('en', 'English'), ('fr', 'Français'), ('es', 'Español')], default='en')

    def __str__(self):
        return self.username

class EmailOTP(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def save(self, *args, **kwargs):
        self.otp = str(uuid.uuid4().int)[:6]  # Generate a 6-digit OTP
        self.expires_at = timezone.now() + timezone.timedelta(minutes=10)  # OTP valid for 10 minutes
        super().save(*args, **kwargs)

    def is_valid(self):
        return timezone.now() < self.expires_at

class Friend(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='friends')
    friend = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='friend_of')

class GameHistory(models.Model):
    player1 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='game_player1', on_delete=models.CASCADE, null=True, blank=True)
    player1_username = models.CharField(max_length=150, null=True, blank=True)
    player2 = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='game_player2', on_delete=models.CASCADE, null=True, blank=True)
    player2_username = models.CharField(max_length=150, null=True, blank=True)
    winner = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='game_winner', on_delete=models.CASCADE, null=True, blank=True)
    winner_username = models.CharField(max_length=150, null=True, blank=True)
    score = models.CharField(max_length=10)
    date_played = models.DateTimeField()

    def __str__(self):
        return f"Game on {self.date_played} - {self.player1 or self.player1_username} vs {self.player2 or self.player2_username}"
