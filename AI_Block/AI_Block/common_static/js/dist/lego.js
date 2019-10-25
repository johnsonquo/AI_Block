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
})({"components/add-remove-factor/add-remove-factor.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addRemoveFactor = void 0;
var addRemoveFactor = {
  delimiters: ['#{', '}'],
  props: {
    index: {
      type: Number,
      default: ''
    },
    item: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    factors: {
      type: Array,
      default: []
    },
    icon: {
      type: String,
      default: 'fas fa-plus'
    }
  },
  data: function data() {
    return {
      selectedFactor: '請選擇',
      factorParameterDay: '',
      factorParameter2: ''
    };
  },
  template: " <tr>\n                    <td @click=\"handleClick\"><i :class=\"iconCls\"></i></td>\n                    <td>\n                        <select v-model=\"selectedFactor\" @change=\"handleChangeFactor\">\n                            <option selected>\u8ACB\u9078\u64C7</option>\n                            <option v-for=\"(factor,index) in factors\" :value=\"factor\" :key=\"index\">#{factor}</option>\n                        </select>\n                    </td>\n                    <td><input type=\"number\" min=\"1\" v-model=\"factorParameterDay\" @input=\"handleChangeFactor\"></td>\n                    <td><input type=\"text\" v-model=\"factorParameter2\" @input=\"handleChangeFactor\"></td>\n                </tr>",
  methods: {
    handleClick: function handleClick() {
      var selectFactorObj = {
        n: this.index,
        index: this.selectedFactor,
        day: this.factorParameterDay,
        parameter2: this.factorParameter2,
        uid: this.item.uid
      };
      this.$emit('handle-click-icon', selectFactorObj);
    },
    selectFactor: function selectFactor(item, factor, index) {
      if (item.index === factor) {
        this.selectedFactor = item.index;
        this.factorParameterDay = item.day;
        this.factorParameter2 = item.parameter2;
        return item.index;
      } else {
        return factor;
      }
    },
    handleChangeFactor: function handleChangeFactor() {
      var selectFactorObj = {
        n: this.index,
        index: this.selectedFactor,
        day: this.factorParameterDay,
        parameter2: this.factorParameter2,
        uid: this.item.uid
      };
      this.$emit('change-factor', selectFactorObj);
    }
  },
  computed: {
    iconCls: function iconCls() {
      return this.icon;
    }
  }
};
exports.addRemoveFactor = addRemoveFactor;
},{}],"../components/progress-circle/progress-circle.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.progressCircle = void 0;
var progressCircle = {
  delimiters: ['#{', '}'],
  props: {
    radius: {
      type: Number,
      default: 120
    },
    percent: {
      type: Number,
      default: 0
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      dashArray: Math.PI * 100
    };
  },
  template: "    \n                <div class=\"progress-circle\" v-show=\"status\">\n                    <div class=\"circle\">\n                        <svg :width=\"radius\" :height=\"radius\" viewBox=\"0 0 100 100\">\n                            <circle class=\"progress-background\" r=\"50\" cx=\"50\" cy=\"50\" fill=\"transparent\"></circle>\n                            <circle class=\"progress-bar\" r=\"50\" cx=\"50\" cy=\"50\" fill=\"transparent\" :stroke-dasharray=\"dashArray\" :stroke-dashoffset=\"dashOffset\"></circle>\n                        </svg>\n                        <h4 class=\"circle-text\">\u904B\u7B97\u4E2D...</h4>\n                    </div>\n                </div>",
  computed: {
    dashOffset: function dashOffset() {
      return (1 - this.percent) * this.dashArray;
    }
  }
};
exports.progressCircle = progressCircle;
},{}],"../store/store.mjs":[function(require,module,exports) {
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
},{}],"../components/singup/singup.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.singUp = void 0;

var _store = require("../../store/store.mjs");

var singUp = {
  delimiters: ['#{', '}'],
  props: {
    status: false
  },
  data: function data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      username: '',
      errorMsg: ''
    };
  },
  template: "\n                <div class=\"singup\" v-show=\"status\">\n\n                    <div class=\"singup-wrapper\">\n\n                        <i class=\"fas fa-times\" @click=\"hide\"></i>\n\n                        <h3>\u8A3B\u518A</h3>\n                        \n                        <form @submit.prevent=\"singUp\">\n\n                            <input type=\"email\" placeholder=\"\u96FB\u5B50\u90F5\u4EF6\" v-model=\"email\" required>\n                            <input type=\"text\" placeholder=\"\u7528\u6236\u540D\" v-model=\"username\" required>\n                            <input type=\"password\" placeholder=\"\u5BC6\u78BC\" v-model=\"password\" required>\n                            <input type=\"password\" placeholder=\"\u78BA\u8A8D\u5BC6\u78BC\" v-model=\"confirmPassword\" required>\n                            <p class=\"error\" v-show=\"errorMsg\">#{errorMsg}</p>\n\n                            <button  class=\"btn-normal\">\u8A3B\u518A</button>\n                        </form>\n\n                        <h4>\u5DF2\u7D93\u64C1\u6709\u5E33\u6236? <a href=\"#\" @click=\"showLogin\">\u767B\u5165</a></h4>\n\n                    </div>\n\n                </div>\n    ",
  methods: {
    singUp: function singUp() {
      this.errorMsg = '';

      if (this.password !== this.confirmPassword) {
        this.errorMsg = '密碼不匹配，請重新輸入';
      } // post singup api


      this._empty();
    },
    showLogin: function showLogin() {
      this.hide();
      _store.store.state.showLogin = true;
    },
    hide: function hide() {
      this._empty();

      _store.store.state.showSingUP = false;
    },
    _empty: function _empty() {
      this.email = '';
      this.username = '';
      this.password = '';
      this.confirmPassword = '';
    }
  }
};
exports.singUp = singUp;
},{"../../store/store.mjs":"../store/store.mjs"}],"../components/login/login.mjs":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Login = void 0;

var _store = require("../../store/store.mjs");

var Login = {
  delimiters: ['#{', '}'],
  props: {
    status: false
  },
  data: function data() {
    return {
      email: '',
      password: ''
    };
  },
  template: "\n                <div class=\"login\" v-show=\"status\">\n\n                    <div class=\"login-wrapper\">\n\n                        <i class=\"fas fa-times\" @click=\"hide\"></i>\n\n                        <h3>\u767B\u5165</h3>\n                        \n                        <form>\n\n                            <input type=\"email\" placeholder=\"\u96FB\u5B50\u90F5\u4EF6\" v-model=\"email\" required>\n                            <input type=\"password\" placeholder=\"\u5BC6\u78BC\" v-model=\"password\" required>\n\n                            <button  class=\"btn-normal\">\u767B\u5165</button>\n\n                        </form>\n\n                        <h4>\u672A\u8A3B\u518A\u5E33\u6236? <a href=\"#\" @click=\"showSingup\">\u53BB\u8A3B\u518A</a></h4>\n\n                    </div>\n\n                </div>\n    ",
  methods: {
    show: function show() {
      _store.store.state.showLogin = true;
    },
    hide: function hide() {
      this._empty();

      _store.store.state.showLogin = false;
    },
    showSingup: function showSingup() {
      this.hide();
      _store.store.state.showSingUP = true;
    },
    _empty: function _empty() {
      this.email = '';
      this.password = '';
    }
  }
};
exports.Login = Login;
},{"../../store/store.mjs":"../store/store.mjs"}],"../components/lego-header/lego-header.mjs":[function(require,module,exports) {
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
},{"../../store/store.mjs":"../store/store.mjs"}],"lego.mjs":[function(require,module,exports) {
"use strict";

var _addRemoveFactor = require("../components/add-remove-factor/add-remove-factor.mjs");

var _progressCircle = require("../components/progress-circle/progress-circle.mjs");

var _singup = require("../components/singup/singup.mjs");

var _login = require("../components/login/login.mjs");

var _legoHeader = require("../components/lego-header/lego-header.mjs");

var _store = require("../store/store.mjs");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

new Vue({
  el: '#app',
  components: {
    legoHeader: _legoHeader.legoHeader,
    addRemoveFactor: _addRemoveFactor.addRemoveFactor,
    progressCircle: _progressCircle.progressCircle,
    singUp: _singup.singUp,
    Login: _login.Login
  },
  data: {
    allStock: '',
    stepTitle: 'STEP1 選股票',
    ai: ['決策樹', '隨機森林'],
    predictArray: ['明天報酬', '下周報酬'],
    factorsArray: ['high', 'low', 'close', 'open', 'volume', 'ma', 'rsi'],
    companyName: '台泥',
    companyCode: '1101',
    selectedAi: '決策樹',
    selectedPredict: '明天報酬',
    sampleInStartDate: '2008-01-01',
    sampleInEndDate: '2013-01-01',
    sampleOutStartDate: '2013-01-02',
    sampleOutEndDate: '2018-01-01',
    factors: '',
    factorCount: [{
      n: 0,
      index: '',
      day: '',
      parameter2: '',
      uid: Math.random()
    }],
    inLimitValue: '',
    outLimitValue: '',
    stopLossPoint: '',
    lockInGainValue: '',
    circlePercent: 0,
    loadingPercent: 0,
    PI: Math.PI * 100,
    status: false
  },
  delimiters: ['#{', '}'],
  methods: {
    getCompany: function () {
      var _getCompany = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var api;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return axios.get('/api/stockList/');

              case 2:
                api = _context.sent;
                this.allStock = api.data;

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getCompany() {
        return _getCompany.apply(this, arguments);
      }

      return getCompany;
    }(),
    selectCompany: function selectCompany(code, company) {
      this.companyCode = code;
      this.companyName = company;
    },
    selectAI: function selectAI(item) {
      this.selectedAi = item;
    },
    selectPredict: function selectPredict(item) {
      this.selectedPredict = item;
    },
    nextStep: function nextStep(step) {
      var _this$_changeCurrentS = this._changeCurrentStep(),
          mainLeftBoxes = _this$_changeCurrentS.mainLeftBoxes,
          mainRightBoxes = _this$_changeCurrentS.mainRightBoxes;

      mainRightBoxes[step].style.display = 'flex';
      mainLeftBoxes[step].className += " step-active";
    },
    changeMainRightBox: function changeMainRightBox(e, currentStep, stepTitle) {
      this._changeCurrentStep();

      this.$refs[currentStep].style.display = "flex";
      e.currentTarget.className += " step-active";
      this.stepTitle = currentStep.toUpperCase() + ' ' + stepTitle;
    },
    handleClickIcon: function handleClickIcon(data) {
      if (data.n === this.factorCount.length - 1) {
        this.factorCount[data.n] = data;
        this.factorCount.push({
          n: data.n + 1,
          index: '',
          day: '',
          parameter2: '',
          uid: Math.random()
        });
      } else {
        this.factorCount.splice(data.n, 1);
      }
    },
    handleIconText: function handleIconText(index) {
      if (index === this.factorCount.length - 1) {
        return 'fas fa-plus';
      } else {
        return 'fas fa-minus';
      }
    },
    changeFactor: function changeFactor(data) {
      this.factors = this.selectedFactor + ' ' + data.index;
      this.factorCount[data.n] = data;
    },
    postData: function postData() {
      var _this = this;

      this.status = true;
      var postData = {
        companyName: this.companyName,
        companyCode: this.companyCode,
        selectedAi: this.selectedAi,
        selectedPredict: this.selectedPredict,
        sampleInStartDate: this.sampleInStartDate,
        sampleInEndDate: this.sampleInEndDate,
        sampleOutStartDate: this.sampleOutStartDate,
        sampleOutEndDate: this.sampleOutEndDate,
        factor: this.factorCount,
        inLimitValue: this.inLimitValue,
        outLimitValue: this.outLimitValue,
        stopLossPoint: this.stopLossPoint,
        lockInGainValue: this.lockInGainValue
      };
      var percentSet = 0.8;
      var PI = Math.PI * 100;
      var timer = setInterval(loadingProcess.bind(this), 100);

      function loadingProcess() {
        this.PI--;
        this.loadingPercent = (PI - this.PI) / PI;

        if (this.loadingPercent > percentSet) {
          clearInterval(timer);
        }
      }

      axios.post("/api/evaluate/", postData).then(function (res) {
        if (res.data) {
          clearInterval(timer);
          percentSet = 1;
          timer = setInterval(loadingProcess.bind(_this), 10);
          var promise = new Promise(function (resolve, reject) {
            setTimeout(function () {
              console.log('resolve');
              resolve();
            }, 5000);
          });
          promise.then(function () {
            window.location.href = '/machineResult';
          });
        }
      });
    },
    _changeCurrentStep: function _changeCurrentStep() {
      var mainLeftBoxes = this.$refs.mainLeftBox.children;
      var mainRightBoxes = this.$refs.mainRightBox.children;

      for (var i = 0; i < mainRightBoxes.length; i++) {
        mainLeftBoxes[i].className = mainLeftBoxes[i].className.replace(" step-active", "");
        mainRightBoxes[i].style.display = 'none';
      }

      return {
        mainLeftBoxes: mainLeftBoxes,
        mainRightBoxes: mainRightBoxes
      };
    }
  },
  computed: {
    selectedCompany: function selectedCompany() {
      return this.companyCode + " " + this.companyName;
    },
    selectedSampleInDate: function selectedSampleInDate() {
      if (this.sampleInStartDate && this.sampleInEndDate) {
        return this.sampleInStartDate + " ~ " + this.sampleInEndDate;
      }

      return '';
    },
    selectedSampleOutDate: function selectedSampleOutDate() {
      if (this.sampleOutStartDate && this.sampleOutEndDate) {
        return this.sampleOutStartDate + " ~ " + this.sampleOutEndDate;
      }

      return '';
    },
    selectedFactor: function selectedFactor() {
      return this.factors;
    },
    selectedBackTesting1: function selectedBackTesting1() {
      if (this.inLimitValue && this.outLimitValue) {
        return this.inLimitValue + ' , ' + this.outLimitValue;
      }

      return '';
    },
    selectedBackTesting2: function selectedBackTesting2() {
      if (this.stopLossPoint && this.lockInGainValue) {
        return this.stopLossPoint + ' , ' + this.lockInGainValue;
      }

      return '';
    },
    stepCompletedProcess: function stepCompletedProcess() {
      var completed = [];
      var step3;
      var step6;

      if (this.sampleInStartDate && this.sampleInEndDate && this.sampleOutStartDate && this.sampleOutEndDate) {
        step3 = {
          sampleInStartDate: this.sampleInStartDate,
          sampleInEndDate: this.sampleInEndDate,
          sampleOutStartDate: this.sampleOutStartDate,
          sampleOutEndDate: this.sampleOutEndDate
        };
      }

      if (this.inLimitValue && this.outLimitValue && this.stopLossPoint, this.lockInGainValue) {
        step6 = {
          inLimitValue: this.inLimitValue,
          outLimitValue: this.outLimitValue,
          stopLossPoint: this.stopLossPoint,
          lockInGainValue: this.lockInGainValue
        };
      }

      var stepObj = {
        stepOne: this.companyName,
        steptwo: this.selectedAi,
        stepThree: step3,
        stepFour: this.selectedPredict,
        stepFive: this.factor1,
        stepSix: step6
      };

      for (var i in stepObj) {
        if (stepObj[i]) {
          completed.push(stepObj[i]);
        }
      }

      return completed;
    },
    showSingUP: function showSingUP() {
      return _store.store.state.showSingUP;
    },
    showLogin: function showLogin() {
      return _store.store.state.showLogin;
    }
  },
  watch: {
    stepCompletedProcess: function stepCompletedProcess(newVal) {
      if (newVal.length) {
        var bottom = -145 + 80 / 6 * newVal.length;
        this.circlePercent = Math.floor(100 / 6 * newVal.length);
        this.$refs.wave.style.bottom = bottom + '%';
      }
    },
    sampleInEndDate: function sampleInEndDate(newVal, oldVal) {
      if (!newVal) return;
      var splitDate = newVal.split('-');
      splitDate[1] = Number(splitDate[1]) - 1;
      splitDate[2] = Number(splitDate[2]) + 1;
      var date = new Date(splitDate[0], splitDate[1], splitDate[2]);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();

      if (month < 10) {
        month = '0' + month;
      }

      if (day < 10) {
        day = '0' + day;
      }

      this.sampleOutStartDate = year + '-' + month + '-' + day;
    }
  },
  mounted: function mounted() {
    this.getCompany();
    this.$refs.mainRightBox.children[0].style.display = 'flex';
  }
});
},{"../components/add-remove-factor/add-remove-factor.mjs":"components/add-remove-factor/add-remove-factor.mjs","../components/progress-circle/progress-circle.mjs":"../components/progress-circle/progress-circle.mjs","../components/singup/singup.mjs":"../components/singup/singup.mjs","../components/login/login.mjs":"../components/login/login.mjs","../components/lego-header/lego-header.mjs":"../components/lego-header/lego-header.mjs","../store/store.mjs":"../store/store.mjs"}],"../../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59644" + '/');

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
},{}]},{},["../../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","lego.mjs"], null)
//# sourceMappingURL=/lego.js.map