"use strict";

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.string.trim");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MdReverse = MdReverse;

var _config = require("./config");

var _table = require("./plugins/table");

var _lexer = require("./lexer");

var _parser = require("./parser");

var _vdomt = require("./vdomt");

var _markdown = require("./markdown");

var _tools = require("./tools/tools");

function MdReverse() {
  this.HTML = '';
}

Object.defineProperties(MdReverse.prototype, {
  toMarkdown: {
    value: toMarkdown
  },
  plugin: {
    value: function value(fun) {
      fun.call(this, _config.EL_TYPE, _config.TOKEN_RULE);
      return this;
    }
  }
});

function toMarkdown(htmlStr) {
  this.HTML = _tools.Tools.trim(htmlStr);
  var lexer = new _lexer.Lexer(),
      parser = new _parser.Parser(),
      vdomtree = new _vdomt.VDOMTree(),
      md = new _markdown.Markdown();
  var result = lexer.analysis(this.HTML);
  result = parser.analysis(result);
  result = vdomtree.build(result);
  result = md.translate(result);
  console.log(result);
  return result;
}