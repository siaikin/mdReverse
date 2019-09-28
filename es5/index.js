"use strict";

require("core-js/modules/es.symbol");

require("core-js/modules/es.symbol.description");

require("core-js/modules/es.symbol.iterator");

require("core-js/modules/es.array.for-each");

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.object.assign");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.keys");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.string.iterator");

require("core-js/modules/web.dom-collections.for-each");

require("core-js/modules/web.dom-collections.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require("./lib/config");

var _mdReverse = require("./lib/mdReverse");

Object.keys(_mdReverse).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _mdReverse[key];
    }
  });
});

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var consolee = window.console;

if (process.env.NODE_ENV === 'development') {
  window.clrConsole = Object.assign({}, window.console, {
    success: function success(message) {
      var type = _typeof(message);

      if (type === 'string' || type === 'number' || type === 'boolean') consolee.log('%c' + message, _config.CONSOLE_TYPE.success);else consolee.log(message);
    },
    error: function error(message) {
      var type = _typeof(message);

      if (type === 'string' || type === 'number' || type === 'boolean') consolee.error('%c' + message, _config.CONSOLE_TYPE.error);else consolee.error(message);
    },
    info: function info(message) {
      var type = _typeof(message);

      if (type === 'string' || type === 'number' || type === 'boolean') consolee.info('%c' + message, _config.CONSOLE_TYPE.info);else consolee.info(message);
    },
    warn: function warn(message) {
      var type = _typeof(message);

      if (type === 'string' || type === 'number' || type === 'boolean') consolee.warn('%c' + message, _config.CONSOLE_TYPE.warn);else consolee.warn(message);
    }
  });
} else if (process.env.NODE_ENV === 'production') {}