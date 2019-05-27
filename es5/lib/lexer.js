"use strict";

require("core-js/modules/es.array.slice");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.string.trim");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Lexer = Lexer;

var _tools = require("./tools");

function Lexer() {}

Object.defineProperties(Lexer.prototype, {
  analysis: {
    value: analysis
  }
});

function analysis(str) {
  str = _tools.Tools.trim(str);
  console.time('lexical analysis');
  var result = [];

  var stack = [],
      _char,
      start = 0,
      end = 0;

  for (var i = 0, len = str.length; i < len; i++) {
    _char = str[i];

    switch (_char) {
      case '<':
        if (stack[stack.length - 1] !== '"') {
          stack.push(_char);
          start = i;
          if (start - end > 1 && !_tools.Tools.isEmpty(str, end + 1, start - 1)) result.push(str.slice(end + 1, start));
        }

        break;

      case '>':
        if (stack[stack.length - 1] === '<') {
          stack.pop();
          end = i;
          result.push(str.slice(start, end + 1));
        }

        break;

      case '"':
        if (stack[stack.length - 1] === '"') {
          stack.pop();
        } else if (stack[stack.length - 1] === '<') {
          stack.push(_char);
        }

    }
  }

  console.timeEnd('lexical analysis');
  return result;
}