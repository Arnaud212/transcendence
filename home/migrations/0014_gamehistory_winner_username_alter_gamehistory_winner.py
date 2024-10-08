# Generated by Django 4.2.13 on 2024-07-15 08:44

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0013_gamehistory_player1_username_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='gamehistory',
            name='winner_username',
            field=models.CharField(blank=True, max_length=150, null=True),
        ),
        migrations.AlterField(
            model_name='gamehistory',
            name='winner',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='game_winner', to=settings.AUTH_USER_MODEL),
        ),
    ]
