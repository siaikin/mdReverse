"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tools = void 0;

var _nwodkramConfig = require("./nwodkramConfig");

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
  var ws = _nwodkramConfig.REGEXP.whitespace;

  while (ws.test(str[start]) && start <= end) {
    start++;
  }

  while (ws.test(str[end]) && end >= start) {
    end--;
  }

  return start > end ? '' : str.slice(start, end + 1);
}

function compressWs(str) {
  var ws = _nwodkramConfig.REGEXP.whitespace;
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
  var ws = _nwodkramConfig.REGEXP.whitespace;

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
  var ws = _nwodkramConfig.REGEXP.whitespace;
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

var Tools = new _Tools();
exports.Tools = Tools;