"use strict";

require("core-js/modules/es.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TablePlugin = TablePlugin;

function TablePlugin(EL_TYPE, TOKEN_RULE) {
  EL_TYPE['td'] = 14;
  EL_TYPE['th'] = 16;
  EL_TYPE['tr'] = 18;
  EL_TYPE['table'] = 34;
  EL_TYPE['thead'] = 36;
  EL_TYPE['tbody'] = 38;
  TOKEN_RULE[EL_TYPE['td']] = {
    filterRule: [],
    convertRule: function convertRule(node) {
      return ' ';
    },
    endRule: function endRule(node) {
      return " |";
    }
  };
  TOKEN_RULE[EL_TYPE['th']] = TOKEN_RULE[EL_TYPE['td']];
  TOKEN_RULE[EL_TYPE['tr']] = {
    filterRule: [],
    convertRule: function convertRule(node) {
      return ' ';
    },
    endRule: function endRule(node) {
      return '\n';
    }
  };
  TOKEN_RULE[EL_TYPE['table']] = TOKEN_RULE[EL_TYPE['tr']];
  TOKEN_RULE[EL_TYPE['thead']] = {
    filterRule: [],
    convertRule: function convertRule(node) {
      return '';
    },
    endRule: function endRule(node) {
      return "| ------ | ------ |";
    }
  };
  TOKEN_RULE[EL_TYPE['tbody']] = TOKEN_RULE[EL_TYPE['tr']];
}