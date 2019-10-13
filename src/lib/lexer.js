import {Tools} from "./tools/tools";

function Lexer() {
}

Object.defineProperties(Lexer.prototype, {
    analysis: {
        value: analysis
    }
});

/**
 * 分解传入的HTML字符串
 * @param str - HTML字符串
 * @return {[]}
 */
function analysis(str) {
    str = Tools.trim(str);
    console.time('lexical analysis');
    const result = [];
    let stack = [], char, start = 0, end = 0;
    for (let i = 0, len = str.length, depth; i < len; i++) {
        depth = stack.length;
        char = str[i];
        switch (char) {
            case '<':
                stack.push(char);
                if (depth === 0) {
                    start = i;
                    // 截取HTML标签之间的文本
                    if (start - end > 1 && !Tools.isEmpty(str, end + 1, start - 1))
                        result.push(str.slice(end + 1, start));
                }
                break;
            case '>':
                stack.pop();
                if (depth === 1) {
                    end = i;
                    result.push(str.slice(start, end + 1));
                }
        }
    }

    console.timeEnd('lexical analysis');
    return result;
}


export {
    Lexer
}
