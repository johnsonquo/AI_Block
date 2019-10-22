import numpy as np
import pandas as pd


##我是分隔線-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
#signalTable 要有 date作為index,open, high, low, close, signal, 
#initialCash 為初始金額設定
#tradingTimeing是用close or open來交易 
#signalName 信號變數名稱
#is_marginable 可否融券
#is_all_in 交易是否all in，預設為True ，若False 則會依照shares變數決定買進張數，預設為1
#stopLoss，stopProfit 為停 利/損 金額，0為不設停利停損
def BuildTradeTable(signalTable, signalName, stopLoss = 0, stopProfit = 0, initialCash = 100000000, tax_rate = 0.003, handling_fee_rate = 0.001425, min_handling_fee = 20, is_marginable = False, is_all_in = True, shares = 1, tradeTiming = 'open'):
    pre_holding = 0
    tradePrice = -1
    tradeTable = pd.DataFrame()
    totalProfit = 0
    cash = initialCash
    tradeNum = 0
    signalTable[signalName] = signalTable[signalName].shift(1, fill_value = 0).fillna(0)
    signalTable['nextDayPrice'] = signalTable[tradeTiming].shift(-1)
    for date in signalTable.index:
        item = signalTable[signalTable.index == date]
        holding = pre_holding
        tax = 0
        handling_fee = 0
        signal = int(item[signalName].values)
        todayPrice = float(item[tradeTiming].values)
        nextDayPrice = float(item['nextDayPrice'].values)
        cost = 0
        if((todayPrice*1.5-nextDayPrice<0) | (nextDayPrice*1.5-todayPrice <0)):
            signal = 0
            print(date)
            #print(np.sign(todayPrice*1.5-nextDayPrice), np.sign(nextDayPrice*1.5-todayPrice), signal)
        
        profit = 0 if(holding == 0) else (todayPrice - tradePrice) * holding * shares * 1000 

        if ((profit <= -stopLoss) & (holding != 0) & (stopLoss != 0)):
            holding = 0
            handling_fee = (handling_fee_rate * shares * todayPrice * 1000)
            handling_fee = 20 if (handling_fee < 20) else handling_fee
            tax = todayPrice * tax_rate
            cost = tax + handling_fee
            cash = cash + profit - cost
            tradePrice = -1
        if ((profit >= stopProfit) & (holding != 0) & (stopProfit != 0)):
            holding = 0
            handling_fee = (handling_fee_rate * shares * todayPrice * 1000)
            handling_fee = 20 if (handling_fee < 20) else handling_fee
            tax = todayPrice * tax_rate
            cost = tax + handling_fee
            cash = cash + profit - cost
            tradePrice = -1


        if ((signal == 1) & (pre_holding == 0)): #買入訊號 buy
            tradeNum += 1 
            holding = 1
            if (is_all_in == True):
                shares = int(cash/(todayPrice*1000)) 
            handling_fee = (handling_fee_rate * shares * todayPrice * 1000)
            handling_fee = 20 if (handling_fee < 20) else handling_fee
            cost = tax + handling_fee
            cash = cash + profit - cost
            tradePrice = todayPrice

        if ((signal == -1) & (pre_holding == 0) & (is_marginable == True)): #賣空訊號 sellshort
            tradeNum += 1 
            holding = -1
            if (is_all_in == True):
                shares = int(cash/(todayPrice*1000))
            handling_fee = (handling_fee_rate * shares * todayPrice * 1000)
            handling_fee = 20 if (handling_fee < 20) else handling_fee
            cost = tax + handling_fee
            cash = cash + profit - cost
            tradePrice = todayPrice

        if ((signal != 1) & (pre_holding == 1)): #賣出訊號 sell
            holding = 0
            handling_fee = (handling_fee_rate * shares * todayPrice * 1000)
            handling_fee = 20 if (handling_fee < 20) else handling_fee
            tax = todayPrice * tax_rate
            cost = tax + handling_fee
            cash = cash + profit - cost
            tradePrice = -1

        if ((signal != -1) & (pre_holding == -1)): #回補訊號 buytocover
            holding = 0
            handling_fee = (handling_fee_rate * shares * todayPrice * 1000)
            handling_fee = 20 if (handling_fee < 20) else handling_fee
            tradePrice = -1
            cost = tax + handling_fee
            cash = cash + profit - cost


        totalProfit = cash if ((pre_holding != 0) & (holding == 0)) else (cash + profit)
        tradeTable = tradeTable.append({"date" : date,
                                        "tradeId" : 0 if (holding == 0) else tradeNum, 
                                        "tradePrice" : tradePrice, 
                                        "todayPrice" : todayPrice, 
                                        "holding" : holding, 
                                        "cost" : cost, 
                                        "profit":profit, 
                                        "netValue": totalProfit}, ignore_index=True)
        pre_holding = holding
    return tradeTable
##我是分隔線-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#每筆交易表
def Detail(tradeTable, time_label = "all_year", strategy_label = ""):
    DetailTable = pd.DataFrame(columns = ['交易編號', '買賣', '交易開始日', '交易結束日', '交易天數', '交易報酬率', '交易價格', '平倉價格', '交易日內出現最高價格', '交易日內出現最低價格','交易日內最大可能獲利', '交易日內最大可能損失'])
    tradeTable['lead_netValue'] = tradeTable['netValue'].shift(-1).fillna(method = 'ffill')
    tradeTable['lead_date'] = tradeTable['date'].shift(-1).fillna(method = 'ffill')
    tradeTable['lead_price'] = tradeTable['todayPrice'].shift(-1).fillna(method = 'ffill')
    DetailTable['交易編號'] = tradeTable[tradeTable.tradeId != 0].tradeId.drop_duplicates().values
    DetailTable['買賣'] = tradeTable[tradeTable.tradeId != 0].groupby('tradeId').apply(lambda x:x.holding.head(1).values[0]).values
    DetailTable['買賣'] = np.where(DetailTable['買賣']>0, "買", "賣")
    DetailTable['交易開始日'] = tradeTable[tradeTable.tradeId != 0].groupby('tradeId').apply(lambda x:x.date.head(1).values[0]).values
    DetailTable['交易結束日'] = tradeTable[tradeTable.tradeId != 0].groupby('tradeId').apply(lambda x:x.lead_date.tail(1).values[0]).values
    DetailTable['交易報酬率'] = tradeTable[tradeTable.tradeId != 0].groupby('tradeId').apply(lambda x:x.lead_netValue.tail(1).values[0]/x.netValue.head(1).values[0]).values
    DetailTable['交易價格'] = tradeTable[tradeTable.tradeId != 0].groupby('tradeId').apply(lambda x:x.todayPrice.head(1).values[0]).values
    DetailTable['平倉價格'] = tradeTable[tradeTable.tradeId != 0].groupby('tradeId').apply(lambda x:x.lead_price.tail(1).values[0]).values
    DetailTable['交易日內出現最高價格'] = tradeTable[tradeTable.tradeId != 0].groupby('tradeId').apply(lambda x:max(x.todayPrice.max(), x.lead_price.max())).values
    DetailTable['交易日內出現最低價格'] = tradeTable[tradeTable.tradeId != 0].groupby('tradeId').apply(lambda x:min(x.todayPrice.min(), x.lead_price.min())).values
    DetailTable['交易天數'] = tradeTable[tradeTable.tradeId != 0].groupby('tradeId').apply(lambda x:len(x)+1).values
    DetailTable['交易日內最大可能獲利'] = tradeTable[tradeTable.tradeId != 0].groupby('tradeId').apply(lambda x:x.lead_netValue.max()/x.netValue.head(1).values[0]).values
    DetailTable['交易日內最大可能損失'] = tradeTable[tradeTable.tradeId != 0].groupby('tradeId').apply(lambda x:x.lead_netValue.min()/x.netValue.head(1).values[0]).values
    return DetailTable
##我是分隔線-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#績效表
def Evaluate(tradeTable, time_label = "", strategy_label = ""):
    evaluatingTable = pd.DataFrame(columns = ["期間", "策略" ,"總交易次數","總報酬率", "勝率",  "獲利因子","平均獲利","最大獲利", "平均損失", "最大損失","mdd","風報比","總交易成本", "標準差","ShapeRatio"])
    tradeTable['lead_netValue'] = tradeTable['netValue'].shift(-1).fillna(method = 'ffill')
    tradeDetailList = tradeTable[tradeTable.tradeId != 0].groupby('tradeId').apply(lambda x:x.lead_netValue.tail(1).values[0]/x.netValue.head(1).values[0])
    if(tradeDetailList.size != 0):
        tradeTimes = tradeTable.tradeId.max()-tradeTable[tradeTable.tradeId != 0].tradeId.min()+1
        everyTrade_ret = tradeTable[tradeTable.tradeId != 0].groupby('tradeId').apply(lambda x:x.lead_netValue.tail(1).values[0]/x.netValue.head(1).values[0])
        winLossRate = len(everyTrade_ret[everyTrade_ret>1])/tradeTimes
        totalReturn = float(tradeTable['netValue'].tail(1).values[0]/tradeTable['netValue'].head(1).values[0])
        everyTrade_profit = tradeTable[tradeTable.tradeId != 0].groupby('tradeId').apply(lambda x:x.lead_netValue.tail(1).values[0]-x.netValue.head(1).values[0])
        profitFactor = abs(np.sum(everyTrade_profit[everyTrade_profit>0])/np.nansum(everyTrade_profit[everyTrade_profit<0]))
        ave_profit = 0 if len(everyTrade_ret[everyTrade_ret > 1]) == 0 else np.mean(everyTrade_ret[everyTrade_ret>1])-1
        max_profit = 0 if len(everyTrade_ret[everyTrade_ret > 1]) == 0 else np.max(everyTrade_ret[(everyTrade_ret == max(everyTrade_ret)) & (everyTrade_ret >1)])-1
        ave_loss = 0 if len(everyTrade_ret[everyTrade_ret < 1]) == 0 else np.nanmean(everyTrade_ret[everyTrade_ret < 1])-1
        max_loss = 0 if len(everyTrade_ret[everyTrade_ret < 1]) == 0 else np.min(everyTrade_ret[(everyTrade_ret == min(everyTrade_ret)) & (everyTrade_ret < 1)])-1
        mdd = np.min(tradeTable['netValue'] - tradeTable['netValue'].cummax())
        temp = tradeTable.iloc[:np.argmin(tradeTable['netValue'] - tradeTable['netValue'].cummax()), :]
        #print(temp[temp.netValue == temp['netValue'].cummax().tail(1).values[0]])
        mdd_start_date = temp[temp.netValue == temp['netValue'].cummax()].date.tail(1).values[0]
        mdd_end_date = tradeTable.iloc[np.argmin(tradeTable['netValue'] - tradeTable['netValue'].cummax()), :].date
        mdd_rate = mdd/tradeTable[tradeTable.date == mdd_start_date].netValue.values[0]
        #print(mdd_rate)
        riskReturnRate = float((tradeTable['netValue'].tail(1).values[0] - tradeTable['netValue'].head(1).values[0])/-mdd)
        totalCost = tradeTable.cost.values.sum()/tradeTable['netValue'].head(1).values[0]
        std = np.std(tradeTable.netValue.pct_change())*(252**0.5)
        shapeRatio = np.nanmean(tradeTable.netValue.pct_change())*252**0.5/std
    else:
        tradeTimes = 0
        totalReturn = 0
        winLossRate = 0
        profitFactor = 0
        ave_profit = 0 
        max_profit = 0
        ave_loss = 0
        max_loss = 0
        mdd = 0
        riskReturnRate = 0
        totalCost = 0
        mdd_rate = 0
        std = 0
        shapeRatio = 0
        mdd_start_date = np.nan
        mdd_end_date = np.nan
    evaluatingTable = evaluatingTable.append({"策略":strategy_label,
                                              "期間":str(time_label),
                                              "總交易次數": int(tradeTimes), 
                                              "總報酬率": round(totalReturn, 2), 
                                              "勝率": round(winLossRate, 2), 
                                              "獲利因子": round(profitFactor, 2), 
                                              "平均獲利": round(ave_profit, 2),
                                              "最大獲利": round(max_profit, 2), 
                                              "平均損失": round(ave_loss, 2),
                                              "最大損失": round(max_loss, 2),
                                              "mdd": round(mdd_rate, 2),
                                              "風報比": round(riskReturnRate, 2),
                                              "總交易成本": round(totalCost, 2),
                                              "標準差" : round(std, 2),
                                              "ShapeRatio" : round(shapeRatio, 2),
                                              'mdd開始日期':mdd_start_date, 
                                              'mdd結束日期':mdd_end_date
                                             }, ignore_index=True)



    return evaluatingTable
##我是分隔線-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#峰股指標
def Zigzag(price, high, low, upper_change = 8, lower_change = 6):
    price = np.array(price)
    high = np.array(high)
    low = np.array(low)
    state = 'None' #目前狀態
    extreme_price_List = np.array([price[0]])
    pre_price = price[0]
    pre_max_price_position = 0
    pre_min_price_position = 0
    pre_max_price = price[0]
    pre_min_price = price[0]
    for t in range(1, len(price)):
        extreme_price_List = np.append(extreme_price_List, np.nan)
        if((high[t] > pre_max_price) & (state == 'Upper')):
            pre_max_price_position = t
            pre_max_price = high[t]
        if((low[t] < pre_min_price) & (state == 'Lower')):
            pre_min_price_position = t
            pre_min_price = low[t]
        ##下行轉上升反轉偵測點
        if ((high[t] >= pre_min_price * (1 + upper_change/100)) & (state in ['None', 'Lower'])):
            state = "Upper"
            pre_price = pre_max_price
            extreme_price_List[pre_min_price_position] = 1
            pre_max_price = price[t]
            pre_max_price_position = t
        ##上升轉下行反轉偵測點
        elif ((low[t] <= pre_max_price * (1 - lower_change/100)) & (state in ['None', 'Upper'])):
            state = "Lower"
            pre_price = pre_min_price
            extreme_price_List[pre_max_price_position] = -1
            pre_min_price = price[t]
            pre_min_price_position = t
    return extreme_price_List
##我是分隔線-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#黃金交叉
def cross_over(fastLine, slowLine):
    condition1 = np.isnan(fastLine) == False #快線非na
    condition2 = np.isnan(slowLine) == False #慢線非na
    condition3 = fastLine>slowLine           #快線穿越慢線
    condition4 = (fastLine<slowLine).shift(1)#前一天快線低於慢線
    signal = pd.Series(condition1 & condition2 & condition3 & condition4).astype(int).replace(0, method = 'ffill')
    return signal
##我是分隔線-------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#死亡交叉
def cross_under(fastLine, slowLine):
    condition1 = np.isnan(fastLine) == False #快線非na
    condition2 = np.isnan(slowLine) == False #慢線非na
    condition3 = fastLine<slowLine           #慢線穿越快線
    condition4 = (fastLine>slowLine).shift(1)#前一天慢線低於快線
    signal = pd.Series(condition1 & condition2 & condition3 & condition4).astype(int).replace(0, method = 'ffill')
    return signal