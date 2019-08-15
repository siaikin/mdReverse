import {Tools} from "./tools/tools";

const REGEXP = {
    whitespace: /\s/,
    tag: /<\S+>/g,
    attribute: /[a-zA-Z0-9\-]+=".?"[/s|>]/g,
    escapeMdChar: /([\\`*_{}\[\]()#+\-.!])/g,           // 转义Markdown保留字符
    unescapeHTMLEntry: /&(amp|lt|gt|quot|nbsp);/g       // 反转义HTML实体的保留字符
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
const EL_TYPE = {
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
            } else {
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
            return node['isLast'] ? '' : '\n';
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
            children: [EL_TYPE['code']]
        },
        convertRule: function (node) {
            return ``;
        },
        endRule: function (node) {
            return `\n`;
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
            return `${node.parentNode.type === EL_TYPE['pre'] ? '```\n' : '`'}`;
        },
        endRule: function (node) {
            return `${node.parentNode.type === EL_TYPE['pre'] ? '\n```\n' : '`'}`;
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
            }
        },
        convertRule: function (node) {
            return ``;
        },
        endRule: function (node) {
            return `\n\n`;
        }
    },
    [EL_TYPE['h1']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return `# `;
        },
        endRule: function (node) {
            return `\n`;
        }
    },
    [EL_TYPE['h2']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return `## `;
        },
        endRule: function (node) {
            return `\n`;
        }
    },
    [EL_TYPE['h3']]: {
        filterRule: {
            attribute: [],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return `### `;
        },
        endRule: function (node) {
            return `\n`;
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
            attribute: ['src', 'title'],
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
    warn: 'color: #E6A23A;font-size: 12px',
    error: 'color: #F56C6C;font-size: 12px',
    info: 'color: #909399;font-size: 12px'
};

export {
    REGEXP,
    EL_TYPE,
    TOKEN_RULE,
    GLOBAL_CONFIG,
    CONSOLE_TYPE
}
