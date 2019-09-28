"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.last-index-of");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.date.to-string");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.object.to-string");

require("core-js/modules/es.regexp.to-string");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tools = void 0;

var _config = require("../config");

var TYPE = {
  Array: '[object Array]',
  Boolean: '[object Boolean]',
  BigInt: '[object BigInt]',
  Date: '[object Date]',
  Error: '[object Error]',
  Function: '[object Function]',
  Number: '[object Number]',
  Null: '[object Null]',
  Math: '[object Math]',
  Object: '[object Object]',
  RegExp: '[object RegExp]',
  String: '[object String]',
  Symbol: '[object Symbol]',
  Undefined: '[object Undefined]',
  UnKnown: '[object Unknown]'
};

function _Tools() {}

Object.defineProperties(_Tools.prototype, {
  trim: {
    value: trim
  },
  isEmpty: {
    value: isEmpty
  },
  hasWhiteSpace: {
    value: hasWhiteSpace
  },
  compressWs: {
    value: compressWs
  },
  TYPE: {
    value: TYPE
  },
  typeOf: {
    value: typeOf
  },
  typeIs: {
    value: typeIs
  },
  lastHasLS: {
    value: lastHasLS
  },
  removeLastLS: {
    value: removeLastLS
  }
});
/**
 * 去除字符串头尾空白符（正则中的不可见字符）
 * @param str - 指定字符串
 * @param start - 开始位置默认字符串开头
 * @param end - 结束位置默认字符串结尾
 * @returns {string} - 返回新的字符串不会影响原始string
 */

function trim(str) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : str.length - 1;
  var ws = _config.REGEXP.whitespace;

  while (ws.test(str[start]) && start <= end) {
    start++;
  }

  while (ws.test(str[end]) && end >= start) {
    end--;
  }

  return start > end ? '' : str.slice(start, end + 1);
}

function compressWs(str) {
  var ws = _config.REGEXP.whitespace;
  var start = ws.test(str[0]),
      end = ws.test(str[str.length - 1]);
  str = trim(str);
  return "".concat(start ? ' ' : '').concat(str).concat(end ? ' ' : '');
}
/**
 * 判断是否为空白串
 * @param str
 * @param start
 * @param end
 * @returns {boolean}
 */


function isEmpty(str) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : str.length - 1;
  var ws = _config.REGEXP.whitespace;

  for (; start <= end; start++) {
    if (!ws.test(str[start])) return false;
  }

  return true;
}
/**
 * @deprecated
 * @param str
 * @param start
 * @param end
 * @returns {{headNum: number, tailNum: number, start: number, end: number}}
 */


function hasWhiteSpace(str) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var end = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : str.length - 1;
  var ws = _config.REGEXP.whitespace;
  var head = start,
      tail = end;

  while (ws.test(str[start]) && head <= tail) {
    head++;
  }

  while (ws.test(str[end]) && tail >= head) {
    tail--;
  }

  return {
    headNum: head - start,
    tailNum: end - tail,
    start: head,
    end: tail
  };
}

function typeOf(variable) {
  return Object.prototype.toString.call(variable);
}
/**
 * 判断变量是否为`typeArray`中的某一个类型
 * @param variable - 待判断的变量
 * @param typeArray - 预选类型
 * @return {boolean} - `variable`的类型存在与`typeArray`中返回`true`，不存在返回`false`
 */


function typeIs(variable) {
  var varType = typeOf(variable);

  for (var _len = arguments.length, typeArray = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    typeArray[_key - 1] = arguments[_key];
  }

  for (var i = typeArray.length; i--;) {
    if (varType === typeArray[i]) {
      return true;
    }
  }

  return false;
}
/**
 * 判断字符串末尾是否有换行符
 * @param str
 */


function lastHasLS(str) {
  var CR, LF, max, diff;
  CR = str.lastIndexOf(_config.LineSeparator.CR);
  LF = str.lastIndexOf(_config.LineSeparator.LF);
  max = CR > LF ? CR : LF;
  diff = LF - CR;

  if (max !== str.length - 1) {
    return false;
  } else {
    if (Math.abs(diff) > 1 || diff === -1) {
      return {
        type: max === CR ? 'CR' : 'LF'
      };
    } else if (diff === 1) {
      return {
        type: 'CRLF'
      };
    }
  }

  return false;
}
/**
 * 移除字符串中的最后一个行分割符{@link LineSeparator}，如果存在的话。
 * @param str
 */


function removeLastLS(str) {
  var lastLS = lastHasLS(str);

  switch (lastLS.type) {
    case 'CR':
    case 'LF':
      str = str.slice(0, -1);
      break;

    case 'CRLF':
      str = str.slice(0, -2);
      break;
  }

  return str;
}

var Tools = new _Tools();
exports.Tools = Tools;