// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../store/store.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = void 0;
var store = new Vuex.Store({
  state: {
    showSingUP: false,
    showLogin: false
  }
});
exports.store = store;
},{}],"../components/lego-header/lego-header.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.legoHeader = void 0;

var _store = require("../../store/store.mjs");

var legoHeader = {
  delimiters: ['#{', '}'],
  props: {
    bgc: {
      type: String,
      default: "background:linear-gradient(to right, #3a5b7c, #0f2b4e"
    }
  },
  template: "\n                <header class=\"header\" :style=\"background\">\n\n                    <div class=\"header-left\">\n                        <h1 class=\"logo\"><a href=\"/\"> ForceFintech <span class=\"logo-sub\">A.I lego</span></a></h1>\n                    </div>\n                    \n                    <nav class=\"header-right\">\n                        <ul class=\"nav-box\">\n                            <li class=\"nav-item\"><a href=\"/\">\u9996\u9801</a></li>\n                            <li class=\"nav-item\"><a href=\"/lego\">A.I lego</a></li>\n                            <li class=\"nav-item\"><a href=\"#\" @click=\"singup\">\u8A3B\u518A</a></li>\n                            <li class=\"nav-item\"><a href=\"#\" @click=\"login\" >\u767B\u5165</a></li>\n                        </ul>\n                    </nav>\n\n                </header>\n    ",
  methods: {
    singup: function singup() {
      _store.store.state.showSingUP = true;
    },
    login: function login() {
      _store.store.state.showLogin = true;
    }
  },
  computed: {
    background: function background() {
      return this.bgc;
    }
  }
};
exports.legoHeader = legoHeader;
},{"../../store/store.mjs":"../store/store.mjs"}],"machineResult.mjs":[function(require,module,exports) {
"use strict";

var _legoHeader = require("../components/lego-header/lego-header.mjs");

new Vue({
  el: '#app',
  delimiters: ['#{', '}'],
  components: {
    legoHeader: _legoHeader.legoHeader
  },
  data: function data() {
    this.NetValueChartSettings = {
      digit: 5,
      min: []
    };
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
          data: ['日K']
        },
        xAxis: {
          data: []
        },
        yAxis: {
          min: 'dataMin',
          max: 'dataMax'
        },
        dataZoom: [{
          type: 'slider',
          show: true,
          xAxisIndex: [0]
        }, {
          type: 'inside',
          xAxisIndex: [0]
        }],
        series: [{
          name: '日K',
          type: 'candlestick',
          data: [],
          // 開盤值, 收盤值, 最低值, 最高值
          z: 1,
          itemStyle: {
            normal: {
              color: 'maroon',
              color0: 'forestgreen',
              borderWidth: 1,
              opacity: 1
            }
          }
        }, {
          name: '交易',
          type: 'line',
          data: [],
          smooth: true,
          lineStyle: {
            type: 'dashed',
            color: "#0f2b4e"
          }
        }]
      }
    };
  },
  methods: {
    getResult: function getResult() {
      var _this = this;

      axios.get("/api/evaluate/").then(function (res) {
        var resData = res.data;
        _this.totalNetTitle = _this._getObjProperty(resData.evaluateData[0]);
        _this.totalNetValue = resData.evaluateData;
        _this.latestTradeTitle = _this._getObjProperty(resData.last_five_trade[0]);
        _this.latestTradeValue = resData.last_five_trade;

        _this.initNetValueChart(resData.netValueTable_for_plot);

        _this.initKLineChart(resData.ohlc_data_for_plot, resData.detailData_for_plot);
      });
    },
    initNetValueChart: function initNetValueChart(data) {
      var newData = [],
          allValues = []; // ------------------------------------- //

      settingNetValue.call(this); // ------------------------------------- //

      var minValue = Math.min.apply(Math, allValues);
      this.NetValueChartSettings.min.push(minValue);
      this.netValueChartData = {
        columns: ['日期', 'buy&hold', 'your_strategy'],
        rows: newData // -------------------------------------------- //

      };

      function settingNetValue() {
        var _this2 = this;

        data.forEach(function (item) {
          newData.push({
            '日期': _this2.transformDate(item.date),
            'buy&hold': item.bh_netValue,
            'your_strategy': item.ml_netValue
          });
          allValues.push(item.bh_netValue, item.ml_netValue);
        });
      }
    },
    initKLineChart: function initKLineChart(resKData, resTradeData) {
      var tradeData = [],
          tradeStartIndex = [],
          tradeEndIndex = [];
      var dataForLineChart = [];
      settingKLinechart.call(this);
      reArrageDataForLineChart.call(this);
      initTradeStartAndEndIndex();
      calculatePriceBteweenTradePeriods();
      this.option.series[1].data = dataForLineChart;
      this.kLineChart.setOption(this.option);

      function settingKLinechart() {
        var _this3 = this;

        resKData.forEach(function (item) {
          _this3.option.xAxis.data.push(_this3.transformDate(item['date']));

          _this3.option.series[0].data.push({
            value: [item.open, item.close, item.low, item.high],
            visualMap: false
          });
        });
      }

      function reArrageDataForLineChart() {
        for (var k = 0; k < resKData.length; k++) {
          for (var t = 0; t < resTradeData.length; t++) {
            if (resKData[k]['date'] === resTradeData[t]['交易開始日'] && resKData[k]['date'] !== resTradeData[t]['交易結束日']) {
              tradeData.push({
                date: this.transformDate(resKData[k]['date']),
                value: resKData[k]['open'],
                tradeStart: resKData[k]['open'],
                symbol: 'triangle',
                symbolSize: 20,
                itemStyle: {
                  color: 'orangered'
                }
              });
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
              });
            }

            if (resKData[k]['date'] === resTradeData[t]['交易開始日'] && resKData[k]['date'] === resTradeData[t]['交易結束日']) {
              tradeData.push({
                date: this.transformDate(resKData[k]['date']),
                value: resKData[k]['open'],
                tradeStart: resKData[k]['open']
              });
              tradeData.push({
                date: this.transformDate(resKData[k]['date']),
                value: resTradeData[t]['平倉價格'],
                tradeEnd: resTradeData[t]['平倉價格']
              });
            }
          } // ------------------------------------------------ //


          if (!tradeData[k]) {
            tradeData.push({
              date: this.transformDate(resKData[k]['date']),
              value: ''
            });
          }
        }
      }

      function initTradeStartAndEndIndex() {
        // const dataForLineChart = new Array(tradeData.length);
        dataForLineChart = new Array(tradeData.length);
        tradeData.forEach(function (item, index) {
          if (item.tradeStart) {
            tradeStartIndex.push(index);
          }

          if (item.tradeEnd) {
            tradeEndIndex.push(index);
          }
        });
      }

      function calculatePriceBteweenTradePeriods() {
        for (var s = 0; s < tradeStartIndex.length; s++) {
          var openPrice = tradeData[tradeStartIndex[s]].tradeStart;
          var closePrice = tradeData[tradeEndIndex[s]].tradeEnd;
          var startIndex = tradeStartIndex[s];
          var endIndex = tradeEndIndex[s];
          var diff = closePrice - openPrice;
          var divide = diff / (endIndex - startIndex);
          dataForLineChart[startIndex] = tradeData[startIndex];
          dataForLineChart[endIndex] = tradeData[endIndex];

          for (var x = startIndex + 1; x < endIndex; x++) {
            if (diff < 0) {
              dataForLineChart[x] = openPrice + (x - startIndex) * divide;
            }

            if (diff === 0) {
              dataForLineChart[x] = openPrice;
            }

            if (diff > 0) {
              dataForLineChart[x] = openPrice + (x - startIndex) * divide;
            }
          }
        }
      }
    },
    transformDate: function transformDate(date) {
      return date.split('T')[0];
    },
    roundOffNumber: function roundOffNumber(number) {
      return number.toFixed(2) * 1;
    },
    _getObjProperty: function _getObjProperty(obj) {
      var objProperty = [];

      for (var property in obj) {
        objProperty.push(property);
      }

      return objProperty;
    }
  },
  created: function created() {
    this.getResult();
  },
  mounted: function mounted() {
    this.kLineChart = echarts.init(this.$refs.candlestick);
  }
});
},{"../components/lego-header/lego-header.mjs":"../components/lego-header/lego-header.mjs"}],"../../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59658" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","machineResult.mjs"], null)
//# sourceMappingURL=/machineResult.js.map