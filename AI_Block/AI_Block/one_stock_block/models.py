from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.fields.jsonb import JSONField
# Create your models here.
class Block(models.Model):
    username = models.CharField(max_length = 20)
    model_name = models.CharField(max_length = 20)
    Insample_start_date = models.DateField()
    Insample_end_date = models.DateField()
    Outsample_start_date = models.DateField()
    Outsample_end_date = models.DateField()
    stock = models.TextField()
    feature = JSONField()
    answer = models.TextField()
    ml_method = models.TextField()
    
    class Meta:
        db_table = "Block_Input"


#date	day_close_rate	code	name	voucher_usage_rate	utilization_usage_rate	voucher_utilization_ratio	after_market_p	score	trust_cost	trust_ratio	trust_bs	self_cost	self_ratio	self_bs	foreign_cost	foreign_ratio	foreign_bs	external_disk	inner_disk	tail_volume	volume	close	low	high	open
class Stock(models.Model):
    date = models.DateField()
    day_close = models.FloatField()
    code = models.TextField()
    name = models.TextField()
    voucher_usage_rate = models.FloatField()
    utilization_usage_rate = models.FloatField()
    voucher_utilization_ratio = models.FloatField()
    after_market_p = models.FloatField()
    score = models.FloatField()
    trust_cost = models.FloatField()
    trust_ratio = models.FloatField()
    trust_bs = models.FloatField()
    self_cost = models.FloatField()
    self_ratio = models.FloatField()
    self_bs = models.FloatField()
    foreign_cost = models.FloatField()
    foreign_ratio = models.FloatField()
    foreign_bs = models.FloatField()
    external_disk = models.FloatField()
    inner_disk = models.FloatField()
    tail_volume = models.FloatField()
    volume = models.FloatField()
    close = models.FloatField()
    low = models.FloatField()
    high = models.FloatField() 
    open =  models.FloatField() 

    class Meta:
        db_table = "Stock_Data"