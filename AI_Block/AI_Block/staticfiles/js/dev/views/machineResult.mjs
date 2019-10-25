import {legoHeader} from '../components/lego-header/lego-header.mjs';

new Vue({
    el: '#app',
    delimiters: ['#{', '}'],
    components: {
        legoHeader
    },
    data () {

        this.NetValueChartSettings = {
            digit: 5,
            min: []
        }

        return {
            totalNetTitle: [],
            totalNetValue: [],
            latestTradeTitle: [],
            latestTradeValue: [],
            netValueChartData: {},
            kLineChart: '',
            option: {
                tooltip: {},
                legend: {
                    data:['日K']
                },
                xAxis: {
                    data: []
                },
                yAxis: {
                    min: 'dataMin',
                    max: 'dataMax'
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        xAxisIndex: [0],
                    },
                    {
                        type: 'inside',
                        xAxisIndex: [0]
                    }
                ],
                series: [
                    {
                        name: '日K',
                        type: 'candlestick',
                        data: [], // 開盤值, 收盤值, 最低值, 最高值
                        z: 1,
                        itemStyle: {
                            normal: {
                                color: 'maroon',
                                color0: 'forestgreen',
                                borderWidth: 1,
                                opacity: 1,
                            }
                        },
                    },
                    {
                        name: '交易',
                        type: 'line',
                        data: [],
                        smooth: true,
                        lineStyle: {
                            type: 'dashed',
                            color: "#0f2b4e"
                        }
                    }
                ]
            }
        }
    },
    methods: {
        getResult () {

            axios.get(`/api/evaluate/`).then((res) => {

                const resData = res.data;

                this.totalNetTitle = this._getObjProperty(resData.evaluateData[0]);
                this.totalNetValue = resData.evaluateData;

                this.latestTradeTitle = this._getObjProperty(resData.last_five_trade[0]);
                this.latestTradeValue = resData.last_five_trade;
                
                this.initNetValueChart(resData.netValueTable_for_plot);

                this.initKLineChart(resData.ohlc_data_for_plot,resData.detailData_for_plot);

            })
        },
        initNetValueChart (data) {
            
            const newData = [], allValues = [];

            // ------------------------------------- //
            settingNetValue.call(this);
            // ------------------------------------- //

            const minValue = Math.min(...allValues);

            this.NetValueChartSettings.min.push(minValue)

            this.netValueChartData = {
                columns: ['日期', 'buy&hold', 'your_strategy'],
                rows: newData
            }

            // -------------------------------------------- //
            function settingNetValue () {

                data.forEach((item) => {

                    newData.push({
                        '日期': this.transformDate(item.date),
                        'buy&hold': item.bh_netValue,
                        'your_strategy': item. ml_netValue
                    })

                    allValues.push(item.bh_netValue,item. ml_netValue)

                })
            }

        },
        initKLineChart (resKData,resTradeData) {

            const tradeData = [], tradeStartIndex = [], tradeEndIndex = [];
            
            var dataForLineChart = [];

            settingKLinechart.call(this);
            reArrageDataForLineChart.call(this);
            
            initTradeStartAndEndIndex();
            calculatePriceBteweenTradePeriods();

            this.option.series[1].data = dataForLineChart;
            this.kLineChart.setOption(this.option);

            function settingKLinechart () {

                resKData.forEach(item => {

                    this.option.xAxis.data.push(this.transformDate(item['date']));
                    this.option.series[0].data.push(
                        {
                            value: [item.open,item.close,item.low,item.high],
                            visualMap: false
                        }
                    );
                })

            }

            function reArrageDataForLineChart () {

                for (let k=0; k < resKData.length; k++) {

                    for (let t=0; t < resTradeData.length; t++) {

                            if (resKData[k]['date'] === resTradeData[t]['交易開始日'] && resKData[k]['date']  !== resTradeData[t]['交易結束日'] ) {

                                tradeData.push({
                                    date: this.transformDate(resKData[k]['date']),
                                    value: resKData[k]['open'],
                                    tradeStart: resKData[k]['open'],
                                    symbol: 'triangle',
                                    symbolSize: 20,
                                    itemStyle: {
                                        color: 'orangered'
                                    }
                                })
                            }

                            if (resKData[k]['date'] === resTradeData[t]['交易結束日'] && resKData[k]['date'] !== resTradeData[t]['交易開始日']) {

                            tradeData.push({
                                date: this.transformDate(resKData[k]['date']),
                                value: resTradeData[t]['平倉價格'],
                                tradeEnd: resTradeData[t]['平倉價格'],
                                symbol: 'triangle',
                                symbolSize: 20,
                                symbolRotate: 180,
                                itemStyle: {
                                    color: 'lawngreen'
                                }
                            })
                        }

                            if (resKData[k]['date'] === resTradeData[t]['交易開始日'] && resKData[k]['date']  === resTradeData[t]['交易結束日']) {

                            tradeData.push({
                                date: this.transformDate(resKData[k]['date']),
                                value: resKData[k]['open'],
                                tradeStart: resKData[k]['open'],
                            })

                            tradeData.push({
                                date: this.transformDate(resKData[k]['date']),
                                value: resTradeData[t]['平倉價格'],
                                tradeEnd: resTradeData[t]['平倉價格'],
                            })
                        }
                    }
                    
                    // ------------------------------------------------ //

                    if (!tradeData[k]) {

                        tradeData.push({
                            date: this.transformDate(resKData[k]['date']),
                            value: ''
                        })
                    }

                }

            }

            function initTradeStartAndEndIndex () {

                // const dataForLineChart = new Array(tradeData.length);
                dataForLineChart = new Array(tradeData.length);

                tradeData.forEach((item,index) => {

                    if (item.tradeStart) {
                        tradeStartIndex.push(index);
                    }

                    if (item.tradeEnd) {
                        tradeEndIndex.push(index);
                    }

                })

            }

            function calculatePriceBteweenTradePeriods () {

                for (let s =0; s < tradeStartIndex.length; s++) {
                
                    const openPrice = tradeData[tradeStartIndex[s]].tradeStart;
                    const closePrice   = tradeData[tradeEndIndex[s]].tradeEnd;

                    const startIndex = tradeStartIndex[s];
                    const endIndex   = tradeEndIndex[s];

                    const diff = closePrice - openPrice;
                    const divide = diff / (endIndex - startIndex)

                    dataForLineChart[startIndex] = tradeData[startIndex]
                    dataForLineChart[endIndex]   = tradeData[endIndex]

                    for (let x = startIndex + 1; x < endIndex; x++) {
                        
                        if (diff < 0) {
                            dataForLineChart[x] = openPrice + ((x - startIndex) * divide);
                        }
                        
                        if (diff === 0) {
                            dataForLineChart[x] = openPrice;
                        }
                        
                        if (diff > 0) {
                            dataForLineChart[x] = openPrice + ((x - startIndex) * divide);
                        }
                    }
                }

            }

        },
        transformDate(date) {
            return date.split('T')[0];
        },
        roundOffNumber (number) {
            return number.toFixed(2) * 1;
        },
        _getObjProperty (obj) {

            const objProperty = [];

            for (let property in obj) {    
                objProperty.push(property);
            }

            return objProperty;

        }
    },
    created () {
        this.getResult();
    },
    mounted () {
        this.kLineChart = echarts.init(this.$refs.candlestick);
    }
})