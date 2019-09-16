import {REGEXP} from "../config";

const TYPE = {
    Array: '[object Array]',
    Boolean: '[object Boolean]',
    BigInt: '[object BigInt]',
    Date: '[object Date]',
    Error: '[object Error]',
    Number: '[object Number]',
    Null: '[object Null]',
    Math: '[object Math]',
    Object: '[object Object]',
    RegExp: '[object RegExp]',
    String: '[object String]',
    Symbol: '[object Symbol]',
    Undefined: '[object Undefined]',
    UnKnown: '[object Unknown]',
};

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
    },
    TYPE: {
        value: TYPE
    },
    typeOf: {
        value: typeOf
    },
    typeIs: {
        value: typeIs
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
    for (;start <= end; start++) {
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

function typeOf(variable) {
    return Object.prototype.toString.call(variable);
}

/**
 * 判断变量是否为`typeArray`中的某一个类型
 * @param variable - 待判断的变量
 * @param typeArray - 预选类型
 * @return {boolean} - `variable`的类型存在与`typeArray`中返回`true`，不存在返回`false`
 */
function typeIs(variable, ...typeArray) {
    const varType = typeOf(variable);
    for (let i = typeArray.length; i--;) {
        if (varType === typeArray[i]) {
            return true;
        }
    }
    return false;
}
export var Tools = new _Tools();
