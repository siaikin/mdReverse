import {Tools} from "../tools/tools";

/**
 * [Strikethrough扩展语法]{ https://www.markdownguide.org/extended-syntax/#strikethrough}
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
