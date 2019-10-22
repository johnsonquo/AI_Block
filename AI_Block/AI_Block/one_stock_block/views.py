# Create your views here.
from one_stock_block.models import Block, Stock
from django.contrib.auth.models import User
from one_stock_block.serializers import BlockSerializer, StockSerializer, UserSerializer
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http.response import HttpResponseRedirect
from rest_framework_extensions.cache.mixins import CacheResponseMixin
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework import viewsets
import json
import datetime
from django.shortcuts import render
from django.core.serializers.json import DjangoJSONEncoder
from one_stock_block.dobackTest import *
from rest_framework.decorators import api_view
from django.core.cache import cache
from rest_framework import status


# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request):
        if request.method == 'POST':
            data = self.request.data 
            message = ""
            try:
                print(data['username'])
                user = User.objects.get(username=data['username'])  #以 user 取得名稱為「test」的資料
            except:
                user = None   #若「test」不存在則設定為 None
            if user != None:
                message = " 帳號已經存在! "
                return Response(message)
            else:  #建立 test 帳號
                user = User.objects.create(username = data['username'], email = data['email'], password = data["password"])
                user.first_name = ""
                user.last_name = ""
                user.is_staff = "True"
                user.save()    #將資料寫入資料庫
                item = UserSerializer(user)
                print(item.data)
                message = "註冊成功"
                return Response(message, status=status.HTTP_201_CREATED)

    @action(detail = True, methods=['post'])
    def checkUser(self, request):
        if request.method == 'POST':
            data = self.request.data 
            message = ""
            try:
                user = User.objects.get(username=data['username'])
            except:
                user = None
            if(user == None):
                message = "用戶不存在"
                return Response(message)
            else:
                if(user.password == data["password"]):
                    item = UserSerializer(user)
                    return Response(item.data ,status.HTTP_200_OK)
                else:
                    message = "密碼錯誤"
                    return Response(message)




class BlockViewSet( CacheResponseMixin, viewsets.ModelViewSet):
    http_method_names = ['get', 'post']
    queryset = Block.objects.all()
    serializer_class = BlockSerializer
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    search_fields = ('username','id')


    @action(detail = True)
    def CreateInputPage(self, request):
        return HttpResponseRedirect("")

class StockViewSet( CacheResponseMixin, viewsets.ModelViewSet):

    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    search_fields = ('code','name')
    ordering_fields = ('date', 'close')

    @action(detail = True, methods=['post'])
    def evaluate(self, request):
        output_table = []
        if request.method == 'POST':
            data = self.request.data 
            print(data)
            inner_start_date = data['sampleInStartDate']
            inner_end_date = data['sampleInEndDate']
            outer_start_date = data['sampleOutStartDate']
            outer_end_date = data['sampleOutEndDate']
            stock_selected = data['companyCode']
            answer_y = data['selectedPredict']
            method_selected = data['selectedAi']
            table_feature = data['factor']
            inLimitValue =  0 if data['inLimitValue'] == "" else data['inLimitValue']
            outLimitValue = 0 if data['outLimitValue'] == "" else data['outLimitValue']
            stopLossPoint = 0 if data['stopLossPoint'] == "" else data['stopLossPoint']
            lockInGainValue = 0 if data['lockInGainValue'] == "" else data['lockInGainValue']
            netValueData, detailData, evaluateData, bh_netValueData, ohlc_data_for_plot = Do_back_test(inner_start_date, inner_end_date, outer_start_date, outer_end_date, stock_selected, answer_y, method_selected, table_feature, inLimitValue, outLimitValue, stopLossPoint, lockInGainValue)
            last_five_trade = detailData.tail(5)
            netValueTable_for_plot = Get_netValue_for_plot(netValueData, bh_netValueData)
            detailData_for_plot = Get_DetailData_for_plot(detailData)
            output_table = {
                'evaluateData':evaluateData.to_dict(orient='records'),
                'last_five_trade':last_five_trade.to_dict(orient='records'),
                'netValueTable_for_plot':netValueTable_for_plot.to_dict(orient='records'),
                'ohlc_data_for_plot':ohlc_data_for_plot.to_dict(orient='records'),
                'detailData_for_plot':detailData_for_plot.to_dict(orient='records'),
                }
            cache.set("output_table", output_table, timeout=60*10)
        return Response(True)

    @action(detail = False, methods = ["get"])
    def Get_Evaluate(self, request):
        if request.method == 'GET':
            output_table = cache.get("output_table")
            return Response(output_table)


    @action(detail = False)
    def Get_stockList(self, request):
        if request.method == 'GET':
            return Response(Get_stockList().to_dict(orient='records'))



def CreateSelectPage(request):
    return render(request, 'one_stock_block/lego.html')

def CreateResultPage(request):
    return render(request, 'one_stock_block/machineResult.html')

def CreateIndexPage(request):
    return render(request, 'one_stock_block/index.html')

def CreateAiLegoPage(request):
    return render(request, 'one_stock_block/ai-lego.html')

