from rest_framework import serializers
from one_stock_block.models import Block, Stock
from django.contrib.auth.models import User
#from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_jwt.settings import api_settings
from django.contrib.auth.hashers import make_password


class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Block
        fields = '__all__'

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    #password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.password = make_password(instance.password)
            print(instance)
        instance.save()
        return instance

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'token',)


