# Generated by Django 5.0.7 on 2024-07-25 17:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='node',
            name='name',
            field=models.CharField(default='xyz', max_length=100),
        ),
    ]
