import {Tools} from "../tools/tools";

/**
 * [Table扩展语法]{ https://www.markdownguide.org/extended-syntax/#tables}
 * @param addToken
 * @param EL_TYPE
 * @constructor
 */
function TablePlugin(addToken, EL_TYPE) {
    addToken('td', true, {
        filterRule: {
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return ' ';
        },
        endRule: function (node) {
            return ` |`;
        }
    });
    addToken('th', true, {
        filterRule: {
            attribute: [{name: 'style'}],
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return ' ';
        },
        endRule: function (node) {
            return ` |`;
        }
    });
    addToken('tr', true, {
        filterRule: {
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return '|';
        },
        endRule: function (node) {
            return '\n';
        }
    });
    addToken('table', true, {
        filterRule: {
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return '';
        },
        endRule: function (node) {
            return '\n';
        }
    });
    addToken('thead', true, {
        filterRule: {
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return '';
        },
        endRule: function (node) {
            const ths = node.children[0].children;
            let str = '|', hyphens = '----', colon = ':', ws = ' ';
            for (let i = 0, len = ths.length, th, cssObj; i < len; i++) {
                th = ths[i];
                cssObj = Tools.formatCSS(th.attribute.style);
                switch (cssObj['text-align']) {
                    case 'left':
                        str += ws + colon + hyphens + ws;
                        break;
                    case 'center':
                        str += ws + colon + hyphens + colon + ws;
                        break;
                    case 'right':
                        str += ws + hyphens + colon + ws;
                        break;
                    default:
                        str += ws + hyphens + ws;
                }
                str += '|';
            }
            return `${str}\n`;
        }
    });
    addToken('tbody', true, {
        filterRule: {
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return '';
        },
        endRule: function (node) {
            return '';
        }
    });
}

export {
    TablePlugin
}
