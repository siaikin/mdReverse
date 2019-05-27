import {REGEXP, EL_TYPE, TOKEN_RULE} from "./nwodkramConfig";
import {TablePlugin} from "./plugins/table";
import {Lexer} from "./lexer";
import {Parser} from "./parser";
import {VDOMTree} from "./vdomt";
import {Markdown} from "./markdown";
import {Tools} from "./tools";

function MdReverse() {
    this.HTML = '';
}

Object.defineProperties(MdReverse.prototype, {
    toMarkdown: {
        value: toMarkdown
    },
    plugin: {
        value: function (fun) {
            fun.call(this, EL_TYPE, TOKEN_RULE);
            return this;
        }
    }
});

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

export {
    MdReverse
}
