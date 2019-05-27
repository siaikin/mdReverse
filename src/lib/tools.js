import {REGEXP} from "./nwodkramConfig";

function _Tools() {

}

Object.defineProperties(_Tools.prototype, {
    trim: {
        value: trim
    },
    isEmpty: {
        value: isEmpty
    },
    hasWhiteSpace: {
        value: hasWhiteSpace
    },
    compressWs: {
        value: compressWs
    }
});

/**
 * 去除字符串头尾空白符（正则中的不可见字符）
 * @param str - 指定字符串
 * @param start - 开始位置默认字符串开头
 * @param end - 结束位置默认字符串结尾
 * @returns {string} - 返回新的字符串不会影响原始string
 */
function trim(str, start = 0, end = str.length - 1) {
    const ws = REGEXP.whitespace;
    while (ws.test(str[start]) && start <= end) start++;
    while (ws.test(str[end]) && end >= start) end--;

    return start > end ? '' : str.slice(start, end + 1);
}

function compressWs(str) {
    const ws = REGEXP.whitespace;
    let start = ws.test(str[0]), end = ws.test(str[str.length - 1]);
    str = trim(str);

    return `${start ? ' ' : ''}${str}${end ? ' ' : ''}`
}


/**
 * 判断是否为空白串
 * @param str
 * @param start
 * @param end
 * @returns {boolean}
 */
function isEmpty(str, start = 0, end = str.length - 1) {
    const ws = REGEXP.whitespace;
    for (;start <= end;start++) {
        if (!ws.test(str[start])) return false;
    }

    return true;
}

/**
 * @deprecated
 * @param str
 * @param start
 * @param end
 * @returns {{headNum: number, tailNum: number, start: number, end: number}}
 */
function hasWhiteSpace(str, start = 0, end = str.length - 1) {
    const ws = REGEXP.whitespace;
    let head = start, tail = end;
    while (ws.test(str[start]) && head <= tail) head++;
    while (ws.test(str[end]) && tail >= head) tail--;

    return {
        headNum: head - start,
        tailNum: end - tail,
        start: head,
        end: tail
    }
}
export var Tools = new _Tools();
