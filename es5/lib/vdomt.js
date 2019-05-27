"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.array.filter");

require("core-js/modules/es.array.includes");

require("core-js/modules/es.array.is-array");

require("core-js/modules/es.array.splice");

require("core-js/modules/es.object.define-properties");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.string.includes");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VDOMTree = VDOMTree;

var _nwodkramConfig = require("./nwodkramConfig");

function VDOMTree() {}

Object.defineProperties(VDOMTree.prototype, {
  build: {
    value: build
  }
});
/**
 * 生成虚拟DOM树
 */

function build(tokenArr) {
  var rootNode = {
    tag: 'root',
    type: _nwodkramConfig.EL_TYPE['rootNode'],
    position: 1
  },
      stack = [rootNode];
  var parNode = rootNode,
      curNode,
      children,
      childrenLen,
      filterChild = [_nwodkramConfig.EL_TYPE['all_element']];
  console.time('virtual dom tree build');

  while (curNode = tokenArr.pop()) {
    // 构建DOM树
    if (curNode.position === 1) {
      // 开标签
      if (!filterChildren(tokenArr, curNode, filterChild)) {
        // curNode是否是父节点允许的子节点类型
        continue;
      }

      stack.push(curNode);
      parNode = curNode;
      filterChild = _nwodkramConfig.TOKEN_RULE[parNode.type].filterRule.children;
    } else if (curNode.position === 2) {
      // 闭标签
      if (curNode.type !== stack[stack.length - 1].type) {
        throw new Error("opening tag ".concat(stack[stack.length - 1].tag, ", closing tag ").concat(curNode.tag));
      }

      curNode = stack.pop();
      parNode = stack[stack.length - 1];
      children = curNode.children;
      childrenLen = children ? children.length : 0;
      if (childrenLen > 0) children[childrenLen - 1]['isLast'] = true; // 给最后一个子节点添加标记

      filterChild = _nwodkramConfig.TOKEN_RULE[parNode.type].filterRule.children;

      if (_nwodkramConfig.GLOBAL_CONFIG.excludeElement[curNode.type]) {
        // 当前节点为注释节点跳过
        if (_nwodkramConfig.GLOBAL_CONFIG.excludeElement[curNode.type].option === 2) continue;
      }

      if (!parNode.children) parNode.children = [];
      curNode['parentNode'] = parNode;
      curNode['index'] = parNode.children.length;
      parNode.children.push(curNode);
    } else if (curNode.position === 3) {
      // 空标签或文本节点
      if (!parNode.children) parNode.children = [];
      curNode['parentNode'] = parNode;
      curNode['index'] = parNode.children.length;
      parNode.children.push(curNode);
    }
  }

  console.timeEnd('virtual dom tree build');
  return rootNode;
}
/**
 * 判断该节点（node）是否符合过滤条件（filterRule）
 * @param tokens
 * @param node
 * @param filterRule
 * @returns {boolean}
 */


function filterChildren(tokens, node, filterRule) {
  var rule = filterRule,
      filter;

  if (!Array.isArray(filterRule)) {
    rule = filterRule.include;
    filter = filterRule.filter;
  }

  if (rule.includes(_nwodkramConfig.EL_TYPE['all_element']) || rule.includes(node.type)) return true;
  filterTag(tokens, node, rule, filter);
  return false;
}

function filterTag(tokenArr, curNode, rule) {
  var filter = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var node,
      sameCount = 0,
      start = tokenArr.length,
      end = start;

  if (filter) {
    for (var i = tokenArr.length; i--;) {
      node = tokenArr[i];
      start = i + 1;

      if (rule.includes(node.type)) {
        tokenArr.splice(start, end - start);
        end = i;
      }

      if (node.type === curNode.type) {
        if (node.position === 1) sameCount++;else if (sameCount === 0) {
          tokenArr.splice(i, end - i);
          break;
        } else sameCount--;
      }
    }
  } else {
    for (var _i = tokenArr.length; _i--;) {
      node = tokenArr[_i];

      if (node.type === curNode.type) {
        if (node.position === 1) sameCount++;else if (sameCount === 0) {
          tokenArr.splice(_i);
          break;
        }
      }
    }
  }
}