"use strict";

require("core-js/modules/es.array.concat");

require("core-js/modules/es.object.define-property");

require("core-js/modules/es.regexp.exec");

require("core-js/modules/es.string.replace");

require("core-js/modules/es.string.trim");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CONSOLE_TYPE = exports.GLOBAL_CONFIG = exports.TOKEN_RULE = exports.EL_TYPE = exports.REGEXP = exports.LineSeparator = exports.LS = void 0;

var _tools = require("./tools/tools");

var _TOKEN_RULE, _excludeElement;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @namespace
 * @type {{CRLF: string, LF: string, CR: string}}
 */
var LineSeparator = {
  CR: '\r',
  LF: '\n',
  CRLF: '\r\n'
};
exports.LineSeparator = LineSeparator;
var LS = LineSeparator.LF;
exports.LS = LS;
var REGEXP = {
  whitespace: /\s/,
  tag: /<\S+>/g,
  attribute: /[a-zA-Z0-9\-]+=[^\s>]+/g,
  escapeMdChar: /([\\`*_{}\[\]()#+\-.!])/g,
  // 转义Markdown保留字符
  unescapeHTMLEntry: /&(amp|lt|gt|quot|nbsp);/g,
  // 反转义HTML实体的保留字符
  LineSeparator: {}
};
/**
 * [HTML保留字符]{@link https://developer.mozilla.org/en-US/docs/Glossary/Entity#Reserved_characters}
 */

exports.REGEXP = REGEXP;
var RESERVED_CHAR_MAP = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&nbsp;': ' '
};
var EL_TYPE = {
  'rootNode': -4,
  // 无法识别的标签，默认有闭合标签，数值为2的倍数
  'htmlNode': -2,
  'all_element': 0,
  // 双标签（tag）元素，偶数表示
  'a': 2,
  'h': 4,
  'p': 6,
  'em': 8,
  'li': 10,
  'ol': 12,
  'ul': 14,
  'div': 16,
  'pre': 18,
  'code': 20,
  'span': 22,
  'audio': 24,
  'aside': 26,
  'video': 28,
  'strong': 30,
  'script': 32,
  'button': 34,
  'article': 36,
  'blockquote': 38,
  'h1': 40,
  'h2': 42,
  'h3': 44,
  'h4': 46,
  'h5': 48,
  'h6': 50,

  /**
   * 额外非标准HTML元素
   */

  /**
   * [figure]{@link https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/figure}
   */
  'figure': 52,
  'figcaption': 54,
  // 文本元素
  'textNode': 1,
  // 单标签（tag）元素，奇数表示
  'br': 3,
  'hr': 5,
  'img': 7,
  'link': 9,
  '!--': 11,
  'input': 13,
  'meta': 15,
  '!----': 17
};
exports.EL_TYPE = EL_TYPE;
var DEFAULT_RULE = {
  defaultToken: {
    filterRule: {
      attribute: [],
      children: [EL_TYPE['all_element']]
    },
    convertRule: function convertRule(node) {
      return '';
    },
    endRule: function endRule(node) {
      return '\n';
    }
  },
  doubleToken: {
    filterRule: {
      attribute: [],
      children: [EL_TYPE['all_element']]
    },
    convertRule: function convertRule(node) {
      return '';
    },
    endRule: function endRule(node) {
      return '';
    }
  },
  singleToken: {
    filterRule: {
      attribute: [],
      children: []
    },
    convertRule: function convertRule(node) {
      return '';
    },
    endRule: function endRule(node) {
      return '';
    }
  }
};
var TOKEN_RULE = (_TOKEN_RULE = {}, _defineProperty(_TOKEN_RULE, EL_TYPE['rootNode'], DEFAULT_RULE.doubleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['htmlNode'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['all_element']]
  },
  convertRule: function convertRule(node) {
    return "<".concat(node.tag, ">");
  },
  endRule: function endRule(node) {
    return "</".concat(node.tag, ">\n");
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['textNode'], {
  filterRule: {
    attribute: [],
    children: []
  },
  convertRule: function convertRule(node) {
    var content = node.content; // 转换需要转义的字符
    // return (node.isHTML || node.isCode) ? content : content.replace(REGEXP.escapeChar, '\\$1');

    content = content.replace(REGEXP.unescapeHTMLEntry, function (match) {
      return RESERVED_CHAR_MAP[match] || '';
    });

    if (node.parentNode.type === EL_TYPE['strong']) {
      content = _tools.Tools.trim(content);
    } else {
      content = _tools.Tools.compressWs(content);
    }

    return content;
  },
  endRule: function endRule(node) {
    return "";
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['a'], {
  filterRule: {
    attribute: ['href', 'title'],
    children: [EL_TYPE['all_element']]
  },
  convertRule: function convertRule() {
    return '[';
  },
  endRule: function endRule(node) {
    var attr = node.attribute;
    return "](".concat(attr['href'] || '') + (attr['title'] ? " \"".concat(attr['title'], "\"") : "") + ")";
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['h'], DEFAULT_RULE.doubleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['p'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['all_element']]
  },
  convertRule: function convertRule(node) {
    return node['child_pre'] || '';
  },
  endRule: function endRule(node) {
    return "\n\n";
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['em'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['all_element']]
  },
  convertRule: function convertRule(node) {
    return "*";
  },
  endRule: function endRule(node) {
    return "*";
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['li'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['all_element']]
  },
  convertRule: function convertRule(node) {
    return (node['child_pre'] || '') + (node.parentNode.type === EL_TYPE['ol'] ? "".concat(node.index + 1, ". ") : "* ");
  },
  endRule: function endRule(node) {
    return node['isLast'] ? '' : '\n';
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['ol'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['all_element']]
  },
  childNodeRule: {
    pre: function pre(node) {
      var type = node.parentNode.type;
      return type === EL_TYPE['li'] ? '    ' : '';
    }
  },
  convertRule: function convertRule(node) {
    return "".concat(node.parentNode.type === EL_TYPE['li'] ? '\n' : '');
  },
  endRule: function endRule(node) {
    return '';
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['ul'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['all_element']]
  },
  childNodeRule: {
    pre: function pre(node) {
      var type = node.parentNode.type;
      return type === EL_TYPE['li'] ? '    ' : '';
    }
  },
  convertRule: function convertRule(node) {
    return "".concat(node.parentNode.type === EL_TYPE['li'] ? '\n' : '');
  },
  endRule: function endRule(node) {
    // return `${node.parentNode.type === EL_TYPE['li'] ? '' : '\n'}`;
    return '';
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['div'], DEFAULT_RULE.defaultToken), _defineProperty(_TOKEN_RULE, EL_TYPE['pre'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['code']]
  },
  convertRule: function convertRule(node) {
    return "";
  },
  endRule: function endRule(node) {
    return "\n";
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['code'], {
  filterRule: {
    attribute: [],
    children: {
      include: [EL_TYPE['textNode']],
      filter: true
    }
  },
  convertRule: function convertRule(node) {
    return "".concat(node.parentNode.type === EL_TYPE['pre'] ? '```\n' : '`');
  },
  endRule: function endRule(node) {
    return "".concat(node.parentNode.type === EL_TYPE['pre'] ? '\n```\n' : '`');
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['span'], DEFAULT_RULE.doubleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['audio'], DEFAULT_RULE.doubleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['aside'], DEFAULT_RULE.doubleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['video'], DEFAULT_RULE.doubleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['strong'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['all_element']]
  },
  convertRule: function convertRule(node) {
    return " **";
  },
  endRule: function endRule(node) {
    return "** ";
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['script'], DEFAULT_RULE.doubleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['button'], DEFAULT_RULE.doubleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['article'], DEFAULT_RULE.doubleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['blockquote'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['all_element']]
  },
  childNodeRule: {
    pre: function pre(node) {
      return ">   ";
    },
    post: function post(node, child, child_post) {
      if (child.type !== EL_TYPE['blockquote'] || child.isLast) child_post = _tools.Tools.removeLastLS(child_post);
      if (child.isLast) child_post = _tools.Tools.removeLastLS(child_post);
      return child_post;
    }
  },
  convertRule: function convertRule(node) {
    return "";
  },
  endRule: function endRule(node) {
    var end = LS,
        next = node.parentNode.children[node.index + 1];
    if (!next || next.type !== EL_TYPE['blockquote']) end += LS;
    return end;
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['h1'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['all_element']]
  },
  convertRule: function convertRule(node) {
    return "# ";
  },
  endRule: function endRule(node) {
    return "\n";
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['h2'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['all_element']]
  },
  convertRule: function convertRule(node) {
    return "## ";
  },
  endRule: function endRule(node) {
    return "\n";
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['h3'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['all_element']]
  },
  convertRule: function convertRule(node) {
    return "### ";
  },
  endRule: function endRule(node) {
    return "\n";
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['h4'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['all_element']]
  },
  convertRule: function convertRule(node) {
    return "#### ";
  },
  endRule: function endRule(node) {
    return "\n";
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['h5'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['all_element']]
  },
  convertRule: function convertRule(node) {
    return "##### ";
  },
  endRule: function endRule(node) {
    return "\n";
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['h6'], {
  filterRule: {
    attribute: [],
    children: [EL_TYPE['all_element']]
  },
  convertRule: function convertRule(node) {
    return "###### ";
  },
  endRule: function endRule(node) {
    return "\n";
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['figure'], DEFAULT_RULE.doubleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['figcaption'], DEFAULT_RULE.doubleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['br'], {
  filterRule: {
    attribute: [],
    children: []
  },
  convertRule: function convertRule(node) {
    return "\n";
  },
  endRule: function endRule(node) {
    return "";
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['hr'], {
  filterRule: {
    attribute: [],
    children: []
  },
  convertRule: function convertRule(node) {
    return "---\n";
  },
  endRule: function endRule(node) {
    return "";
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['img'], {
  filterRule: {
    attribute: [{
      name: 'src',
      alias: ['data-src']
    }, {
      name: 'title'
    }],
    children: []
  },
  convertRule: function convertRule(node) {
    return '![';
  },
  endRule: function endRule(node) {
    var attr = node.attribute;
    return "](".concat(attr['src'] || '', " \"").concat(attr['title'] || '', "\")\n");
  }
}), _defineProperty(_TOKEN_RULE, EL_TYPE['link'], DEFAULT_RULE.singleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['!--'], DEFAULT_RULE.singleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['input'], DEFAULT_RULE.singleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['meta'], DEFAULT_RULE.singleToken), _defineProperty(_TOKEN_RULE, EL_TYPE['!----'], DEFAULT_RULE.singleToken), _TOKEN_RULE);
exports.TOKEN_RULE = TOKEN_RULE;
var GLOBAL_CONFIG = {
  excludeElement: (_excludeElement = {}, _defineProperty(_excludeElement, EL_TYPE['!--'], {
    option: 2 // option: 1: 过滤掉所有该类型的标签, 2: 移除该标签对应的整个节点

  }), _defineProperty(_excludeElement, EL_TYPE['!----'], {
    option: 2
  }), _defineProperty(_excludeElement, EL_TYPE['htmlNode'], {
    option: 2
  }), _excludeElement)
};
exports.GLOBAL_CONFIG = GLOBAL_CONFIG;
var CONSOLE_TYPE = {
  success: 'color: #67C23A;font-size: 12px',
  warn: 'color: #E6A23A;font-size: 12px',
  error: 'color: #F56C6C;font-size: 12px',
  info: 'color: #909399;font-size: 12px'
};
exports.CONSOLE_TYPE = CONSOLE_TYPE;