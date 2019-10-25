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
},{"../../store/store.mjs":"../store/store.mjs"}],"index.mjs":[function(require,module,exports) {
"use strict";

var _store = require("../store/store.mjs");

var _singup = require("../components/singup/singup.mjs");

var _login = require("../components/login/login.mjs");

var _legoHeader = require("../components/lego-header/lego-header.mjs");

new Vue({
  el: '#app',
  delimiters: ['#{', '}'],
  components: {
    singUp: _singup.singUp,
    Login: _login.Login,
    legoHeader: _legoHeader.legoHeader
  },
  methods: {
    login: function login() {
      this.$refs.login.show();
    },
    test: function test() {
      console.log('check');
    }
  },
  computed: {
    showSingUP: function showSingUP() {
      return _store.store.state.showSingUP;
    },
    showLogin: function showLogin() {
      return _store.store.state.showLogin;
    }
  }
});
},{"../store/store.mjs":"../store/store.mjs","../components/singup/singup.mjs":"../components/singup/singup.mjs","../components/login/login.mjs":"../components/login/login.mjs","../components/lego-header/lego-header.mjs":"../components/lego-header/lego-header.mjs"}],"../../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59603" + '/');

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
},{}]},{},["../../../../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.mjs"], null)
//# sourceMappingURL=/index.js.map