from one_stock_block.BackTest import *
import numpy as np
import os
import pandas as pd
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn import tree
import plotly.offline as py
from plotly import tools
from talib import abstract
import plotly.graph_objs as go
from pyfinance import ols

#執行回測及畫圖
def Do_back_test(inner_start_date, inner_end_date, outer_start_date, outer_end_date, stock_selected, answer_y, method_selected, table_feature, inLimitValue, outLimitValue, stopLossPoint, lockInGainValue):
    #try:
    
    file_path = 'static/data/stock_' + str(stock_selected) + '.csv'
    data = pd.read_csv(file_path, index_col = 'date')[['open', 'high', 'low', 'close', 'volume']].dropna()
    data.index = pd.to_datetime(data.index, format = '%Y%m%d')
    factorList = []
    table_feature = asList(table_feature)[0]
    stopLossPoint = 0 if stopLossPoint == '' else stopLossPoint
    lockInGainValue = 0 if lockInGainValue == '' else lockInGainValue


    for i in range(len(table_feature)):
        if table_feature[i]['index'] == 'ma':
            data[table_feature[i]['index'] + str(table_feature[i]['day'])] = np.array(abstract.SMA(data, int(table_feature[i]['day'])))
            factorList.append(table_feature[i]['index'] + str(table_feature[i]['day']))
        elif table_feature[i]['index'] == 'rsi':
            data[table_feature[i]['index'] + str(table_feature[i]['day'])] = np.array(abstract.RSI(data, int(table_feature[i]['day'])))
            factorList.append(table_feature[i]['index'] + str(table_feature[i]['day']))
        elif table_feature[i]['index'] == 'kd':
            data[table_feature[i]['index'] + "_K"], data[table_feature[i]['index'] + "_D"] = np.array(abstract.STOCH(data))
            factorList.append(table_feature[i]['index'] + "_K")
            factorList.append(table_feature[i]['index'] + "_D")
        elif table_feature[i]['index'] == 'bband':
            data[table_feature[i]['index'] + str(table_feature[i]['day']) + "_Upper"],data[table_feature[i]['index'] + str(table_feature[i]['day']) + "_Middle"], data[table_feature[i]['index'] + str(table_feature[i]['day']) + "_Lower"] = np.array(abstract.BBANDS(data))
            factorList.append(table_feature[i]['index'] + str(table_feature[i]['day']) + "_Upper")
            factorList.append(table_feature[i]['index'] + str(table_feature[i]['day']) + "_Middle")
            factorList.append(table_feature[i]['index'] + str(table_feature[i]['day']) + "_Lower")
        else:
            factorList.append(table_feature[i]['index'])
            #data['rsi'] = np.array(abstract.RSI(data, int(table_params1[i])))
        #factorList.append(table_feature[i]['index'] + str(table_feature[i]['day']))
       
    train_data = data[(data.index >=inner_start_date) & (data.index < inner_end_date)].copy() 
    train_data['train_y'] = Get_train_y(train_data, answer_y) 
    
    train_data = train_data.dropna()
    
    test_data = data[(data.index >= outer_start_date) & (data.index < outer_end_date)].copy()
    test_data = test_data.dropna()
    test_data['sig'] = Get_ML_sig(train_data[factorList + ['train_y']], test_data[factorList], method_selected)
    
    test_data['bh_sig'] = 1
    netValueData = BuildTradeTable(test_data, 'sig', stopProfit = int(lockInGainValue)*1000, stopLoss = int(stopLossPoint) * 1000).replace([np.inf, -np.inf], np.nan)
    detailData = Detail(netValueData).replace([np.inf, -np.inf], np.nan)
    evaluateData = Evaluate(netValueData, "custom", method_selected) 
    bh_netValueData = BuildTradeTable(test_data, 'bh_sig')
    bh_evaluateData = Evaluate(bh_netValueData, 'custom', '買進持有')
    evaluateData = evaluateData.append(bh_evaluateData).replace([np.inf, -np.inf], np.nan)
    netValueData = netValueData.rename(columns={"netValue": "ml_netValue"})
    bh_netValueData= bh_netValueData.rename(columns={"netValue": "bh_netValue"})
    ohlc_data = test_data[['open', 'high', 'low', 'close']].copy()
    ohlc_data['date'] = ohlc_data.index
    ohlc_data = ohlc_data.reset_index(drop = True)
    return netValueData.fillna(''), detailData.fillna(''), evaluateData.fillna(''), bh_netValueData.fillna(''), ohlc_data.fillna('')
    #return evaluateData, 1, 0
    #except:
    #    return 0
#取得機器學習交易信號
def Get_ML_sig(train_data, test_data, method_select):
    if (method_select == 'NB'):
        model = GaussianNB()
    if (method_select == '決策樹'):
        model = tree.DecisionTreeClassifier()
    if (method_select == 'KNN'):
        model = KNeighborsClassifier(n_neighbors=7)
    if (method_select == '隨機森林'):
        model = RandomForestClassifier()
        
    model.fit(train_data.drop('train_y', axis = 1), train_data.train_y)
    predict_y = np.array(model.predict(test_data))
    
    return predict_y
#取得欲學習的y     
def Get_train_y(train_data, answer_y):
    train_y = np.array([])
    if (answer_y == '明天報酬'):
        train_y = np.sign(train_data['close'].pct_change()).shift(-1).fillna(0)
    if (answer_y == '下周報酬'):
        train_y = np.sign(train_data['close']/train_data['close'].shift(5)).shift(-5).fillna(0)
    if (answer_y == '下月報酬'):
        train_y = np.sign(train_data['close']/train_data['close'].shift(20)).shift(-20).fillna(0)
    if (answer_y == '下季報酬'):
        train_y = np.sign(train_data['close']/train_data['close'].shift(60)).shift(-60).fillna(0)
    if (answer_y == 'zigzag'):
        train_y = np.array(pd.Series(Zigzag(train_data['close'], train_data['high'], train_data['low'])).fillna(method = 'ffill'))
    #print(train_y)
    return train_y
#取得plotly圖
def Get_netValue_for_plot(strategy_data, bh_data):
    netvValueData_for_plot = pd.merge(strategy_data[['date', 'ml_netValue']], bh_data[['date', 'bh_netValue']], on = "date")
    netvValueData_for_plot['bh_netValue'] = netvValueData_for_plot['bh_netValue']/netvValueData_for_plot['bh_netValue'].head(1).values[0]
    netvValueData_for_plot['ml_netValue'] = netvValueData_for_plot['ml_netValue']/netvValueData_for_plot['ml_netValue'].head(1).values[0]
    return netvValueData_for_plot

def Get_DetailData_for_plot(detailData):
    detailData_for_plot = detailData[['交易編號', '交易開始日','交易結束日', '交易價格', '平倉價格', '交易報酬率']].copy()
    detailData_for_plot['賺賠'] = np.where(detailData_for_plot['交易報酬率']>0, '賺', '賠')
    return detailData_for_plot


def Get_stockList():
    return pd.read_csv('static/data/stock_list.csv', index_col = 0)

def asList(a):
    list_a = []
    if type(a) == "list":
        list_a += a
    else:
        list_a.append(a)
    return list_a
    
