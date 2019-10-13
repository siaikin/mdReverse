import {REGEXP, EL_TYPE, TOKEN_RULE, DEFAULT_RULE, addToken} from "./config";
import {TablePlugin} from "./plugins/table";
import {Lexer} from "./lexer";
import {Parser} from "./parser";
import {VDOMTree} from "./vdomt";
import {Markdown} from "./markdown";
import {Tools} from "./tools/tools";

function MdReverse() {
    this.HTML = '';
}

Object.defineProperties(MdReverse.prototype, {
    toMarkdown: {
        value: toMarkdown
    },
    use: {
        value: use
    }
});

/**
 * 将HTML字符串转换为Markdown格式
 * @param htmlStr
 * @return {String}
 */
function toMarkdown(htmlStr) {
    this.HTML = Tools.trim(htmlStr);
    const lexer = new Lexer(), parser = new Parser(), vdomtree = new VDOMTree(), md = new Markdown();
    let result = lexer.analysis(this.HTML);
    result = parser.analysis(result);
    result = vdomtree.build(result);
    result = md.translate(result);
    console.log(result);
    return result;
}

function use(plugin) {
    plugin.plugin(addToken, EL_TYPE, DEFAULT_RULE);
    return this;
}
export {
    MdReverse
}
