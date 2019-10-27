import {Tools} from "../tools/tools";

/**
 * @description [Strikethrough扩展语法]{@link https://www.markdownguide.org/extended-syntax/#strikethrough}
 * | 参数 | 描述 |
 * | ---- | ---- |
 * | teleNum | 业务号 |
 * @param addToken
 * @param EL_TYPE
 * @constructor
 */
function StrikethroughPlugin(addToken, EL_TYPE) {
    addToken('del', true, {
        filterRule: {
            children: [EL_TYPE['all_element']]
        },
        convertRule: function (node) {
            return ' ~~';
        },
        endRule: function (node) {
            return `~~ `;
        }
    })
}

export {
    StrikethroughPlugin
}
