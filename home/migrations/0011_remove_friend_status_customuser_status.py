# Generated by Django 4.2.13 on 2024-06-28 08:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0010_customuser_losses_customuser_wins_friend'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='friend',
            name='status',
        ),
        migrations.AddField(
            model_name='customuser',
            name='status',
            field=models.CharField(default='offline', max_length=10),
        ),
    ]
