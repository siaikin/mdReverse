import {Tools} from "./tools/tools";

/**
 * @namespace
 * @type {{CRLF: string, LF: string, CR: string}}
 */
const LineSeparator = {
    CR: '\r',
    LF: '\n',
    CRLF: '\r\n'
};
const LS = LineSeparator.LF;

const REGEXP = {
    whitespace: /\s/,
    tag: /<\S+>/g,
    attribute: /[a-zA-Z0-9\-]+="[^"]+"/g,                   // 截取HTML标签的属性
    escapeMdChar: /([\\`*_{}\[\]()#+\-.!])/g,               // 转义Markdown保留字符
    unescapeHTMLEntry: /&(amp|lt|gt|quot|nbsp);/g,          // 反转义HTML实体的保留字符
    LineSeparator: {
    }
};

/**
 * [HTML保留字符]{@link https://developer.mozilla.org/en-US/docs/Glossary/Entity#Reserved_characters}
 */
const RESERVED_CHAR_MAP = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&nbsp;': ' '
};

let nestingEl = {index: 54};
let emptyEl = {index: 17};
/**
 * HTML元素映射表
 * [关于单/双标签（空/嵌套）元素]{@link https://developer.mozilla.org/zh-CN/docs/Learn/Getting_started_with_the_web/HTML_basics}
 */
let EL_TYPE = {
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
    '!----': 17,
};

const DEFAULT_RULE = {
    defaultToken: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return '';
        },
        endRule: function (node) {
            return '\n';
        }
    },
    doubleToken: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return '';
        },
        endRule: function (node) {
            return '';
        }
    },
    singleToken: {
        filterRule: {
            attribute: [],
            children: []
        },
        convertRule: function (node) {
            return '';
        },
        endRule: function (node) {
            return '';
        }
    }
};

/**
 * HTML元素配置表
 */
const TOKEN_RULE = {
    // // 无法识别的标签，默认有闭合标签，数值为2的倍数
    [EL_TYPE['rootNode']]: DEFAULT_RULE.doubleToken,
    [EL_TYPE['htmlNode']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return `<${node.tag}>`;
        },
        endRule: function (node) {
            return `</${node.tag}>\n`;
        }
    },
    [EL_TYPE['textNode']]: {
        filterRule: {
            attribute: [],
            children: []
        },
        convertRule: function (node) {
            let content = node.content;
            // 转换需要转义的字符
            // return (node.isHTML || node.isCode) ? content : content.replace(REGEXP.escapeChar, '\\$1');
            content = content.replace(REGEXP.unescapeHTMLEntry, function (match) {
                return RESERVED_CHAR_MAP[match] || '';
            });

            if (node.parentNode.type === EL_TYPE['strong']) {
                content = Tools.trim(content);
            } else if (!node.isCode) {
                content = Tools.compressWs(content);
            }
            return content;
        },
        endRule: function (node) {
            return ``;
        }
    },
    [EL_TYPE['a']]: {
        filterRule: {
            attribute: ['href', 'title'],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function () {
            return '[';
        },
        endRule: function (node) {
            const attr = node.attribute;
            return `](${attr['href'] || ''}` + (attr['title'] ? ` "${attr['title']}"` : ``) + `)`;
        }
    },
    [EL_TYPE['h']]: DEFAULT_RULE.doubleToken,
    [EL_TYPE['p']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return node['child_pre'] || '';
        },
        endRule: function (node) {
            return `\n\n`;
        }
    },
    [EL_TYPE['em']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return `*`;
        },
        endRule: function (node) {
            return `*`;
        }
    },
    [EL_TYPE['li']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return (node['child_pre'] || '') + (node.parentNode.type === EL_TYPE['ol'] ? `${node.index + 1}. ` : `* `);
        },
        endRule: function (node) {
            return '\n';
        }
    },
    [EL_TYPE['ol']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        childNodeRule: {
            pre: function (node) {
                const type = node.parentNode.type;
                return type === EL_TYPE['li'] ? '    ' : '';
            }
        },
        convertRule: function (node) {
            return `${node.parentNode.type === EL_TYPE['li'] ? '\n' : ''}`;
        },
        endRule: function (node) {
            return '';
        }
    },
    [EL_TYPE['ul']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        childNodeRule: {
            pre: function (node) {
                const type = node.parentNode.type;
                return type === EL_TYPE['li'] ? '    ' : '';
            }
        },
        convertRule: function (node) {
            return `${node.parentNode.type === EL_TYPE['li'] ? '\n' : ''}`;
        },
        endRule: function (node) {
            // return `${node.parentNode.type === EL_TYPE['li'] ? '' : '\n'}`;
            return '';
        }
    },
    [EL_TYPE['div']]: DEFAULT_RULE.defaultToken,
    [EL_TYPE['pre']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['code'], EL_TYPE['span']]
        },
        convertRule: function (node) {
            return '```\n';
        },
        endRule: function (node) {
            return '\n```\n';
        }
    },
    [EL_TYPE['code']]: {
        filterRule: {
            attribute: [],
            children: {
                include: [EL_TYPE['textNode']],
                filter: true
            }
        },
        convertRule: function (node) {
            return `${node.parentNode.type === EL_TYPE['pre'] ? '' : '`'}`;
        },
        endRule: function (node) {
            return `${node.parentNode.type === EL_TYPE['pre'] ? '' : '`'}`;
        }
    },
    [EL_TYPE['span']]: DEFAULT_RULE.doubleToken,
    [EL_TYPE['audio']]: DEFAULT_RULE.doubleToken,
    [EL_TYPE['aside']]: DEFAULT_RULE.doubleToken,
    [EL_TYPE['video']]: DEFAULT_RULE.doubleToken,
    [EL_TYPE['strong']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return ` **`;
        },
        endRule: function (node) {
            return `** `;
        }
    },
    [EL_TYPE['script']]: DEFAULT_RULE.doubleToken,
    [EL_TYPE['button']]: DEFAULT_RULE.doubleToken,
    [EL_TYPE['article']]: DEFAULT_RULE.doubleToken,
    [EL_TYPE['blockquote']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        childNodeRule: {
            pre: function (node) {
                return `>   `;
            },
            post: function (node, child, child_post) {
                if (child.type !== EL_TYPE['blockquote'] || child.isLast)
                    child_post = Tools.removeLastLS(child_post);
                if (child.isLast)
                    child_post = Tools.removeLastLS(child_post);
                return child_post;
            }
        },
        convertRule: function (node) {
            return ``;
        },
        endRule: function (node) {
            let end = LS, next = node.parentNode.children[node.index + 1];
            if (!next || next.type !== EL_TYPE['blockquote']) end += LS;
            return end;
        }
    },
    [EL_TYPE['h1']]: {
        filterRule: {
            attribute: ['id'],
            children: {
                include: [EL_TYPE['textNode']],
                filter: true
            }
        },
        convertRule: function (node) {
            return `# `;
        },
        endRule: function (node) {
            let str, id = node.attribute.id;
            if (Tools.typeOf(id) === Tools.TYPE.String &&
                id.length > 0) {
                str = ` {#${node.attribute.id}}\n`;
            } else {
                str = '\n';
            }
            return str;
        }
    },
    [EL_TYPE['h2']]: {
        filterRule: {
            attribute: ['id'],
            children: {
                include: [EL_TYPE['textNode']],
                filter: true
            }
        },
        convertRule: function (node) {
            return `## `;
        },
        endRule: function (node) {
            let str, id = node.attribute.id;
            if (Tools.typeOf(id) === Tools.TYPE.String &&
                id.length > 0) {
                str = ` {#${node.attribute.id}}\n`;
            } else {
                str = '\n';
            }
            return str;
        }
    },
    [EL_TYPE['h3']]: {
        filterRule: {
            attribute: ['id'],
            children: {
                include: [EL_TYPE['textNode']],
                filter: true
            }
        },
        convertRule: function (node) {
            return `### `;
        },
        endRule: function (node) {
            let str, id = node.attribute.id;
            if (Tools.typeOf(id) === Tools.TYPE.String &&
                id.length > 0) {
                str = ` {#${node.attribute.id}}\n`;
            } else {
                str = '\n';
            }
            return str;
        }
    },
    [EL_TYPE['h4']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return `#### `;
        },
        endRule: function (node) {
            return `\n`;
        }
    },
    [EL_TYPE['h5']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return `##### `;
        },
        endRule: function (node) {
            return `\n`;
        }
    },
    [EL_TYPE['h6']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return `###### `;
        },
        endRule: function (node) {
            return `\n`;
        }
    },
    [EL_TYPE['figure']]: DEFAULT_RULE.doubleToken,
    [EL_TYPE['figcaption']]: DEFAULT_RULE.doubleToken,
    [EL_TYPE['br']]: {
        filterRule: {
            attribute: [],
            children: []
        },
        convertRule: function (node) {
            return `\n`;
        },
        endRule: function (node) {
            return ``;
        }
    },
    [EL_TYPE['hr']]: {
        filterRule: {
            attribute: [],
            children: []
        },
        convertRule: function (node) {
            return `---\n`;
        },
        endRule: function (node) {
            return ``;
        }
    },
    [EL_TYPE['img']]: {
        filterRule: {
            attribute: [{name: 'src', alias: ['data-src']}, {name: 'title'}],
            children: []
        },
        convertRule: function (node) {
            return '![';
        },
        endRule: function (node) {
            const attr = node.attribute;
            return `](${attr['src'] || ''} "${attr['title'] || ''}")\n`;
        }
    },
    [EL_TYPE['link']]: DEFAULT_RULE.singleToken,
    [EL_TYPE['!--']]: DEFAULT_RULE.singleToken,
    [EL_TYPE['input']]: DEFAULT_RULE.singleToken,
    [EL_TYPE['meta']]: DEFAULT_RULE.singleToken,
    [EL_TYPE['!----']]: DEFAULT_RULE.singleToken,
};

/**
 * 全局配置，目前主要用于处理注释
 */
const GLOBAL_CONFIG = {
    excludeElement: {
        [EL_TYPE['!--']]: {
            option: 2                                   // option: 1: 过滤掉所有该类型的标签, 2: 移除该标签对应的整个节点
        },
        [EL_TYPE['!----']]: {
            option: 2
        },
        [EL_TYPE['htmlNode']]: {
            option: 2
        }
    }
};

const CONSOLE_TYPE = {
    success: 'color: #67C23A;font-size: 12px',
    error: 'color: #F56C6C;font-size: 12px',
    warn: 'color: #E6A23A;font-size: 12px',
    info: 'color: #909399;font-size: 12px'
};

/**
 * 添加一个HTML元素到EL_TYPE和TOKEN_RULE中
 * @param name - HTML元素标签名
 * @param allowNest - 元素是否允许嵌套标签，即是否为空标签
 * @param rule - 可选配置的规则，默认使用DEFAULT_RULE
 * @return {Error|boolean}
 */
function addToken(name, allowNest = true, rule) {
    let elInfo = allowNest ? nestingEl : emptyEl;
    rule = rule || (allowNest ? DEFAULT_RULE.doubleToken : DEFAULT_RULE.singleToken);
    elInfo.index += 2;
    if (!EL_TYPE[name]) {
        EL_TYPE[name] = elInfo.index;
        TOKEN_RULE[EL_TYPE[name]] = rule;
    }
    else {
        return new Error(`HTMLElement: ${name} already exist!`);
    }
    return true;
}

export {
    LS,
    LineSeparator,
    REGEXP,
    EL_TYPE,
    TOKEN_RULE,
    DEFAULT_RULE,
    GLOBAL_CONFIG,
    CONSOLE_TYPE,
    addToken
}
