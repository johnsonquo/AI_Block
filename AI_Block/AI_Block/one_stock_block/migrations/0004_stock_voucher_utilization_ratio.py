# Generated by Django 2.1.7 on 2019-09-24 14:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('one_stock_block', '0003_auto_20190924_2053'),
    ]

    operations = [
        migrations.AddField(
            model_name='stock',
            name='voucher_utilization_ratio',
            field=models.FloatField(default=0),
            preserve_default=False,
        ),
    ]