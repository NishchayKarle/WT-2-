# Generated by Django 3.0.5 on 2020-04-19 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_medicine_disease'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medicine',
            name='disease',
            field=models.CharField(max_length=10),
        ),
    ]