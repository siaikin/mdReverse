import {EL_TYPE, GLOBAL_CONFIG, TOKEN_RULE} from "./config";

function VDOMTree() {

}

Object.defineProperties(VDOMTree.prototype, {
    build: {
        value: build
    }
});

/**
 * 生成虚拟DOM树
 */
function build(tokenArr) {
    const rootNode = {tag: 'root', type: EL_TYPE['rootNode'], position: 1}, stack = [rootNode];
    let parNode = rootNode, curNode, children, childrenLen, filterChild = [EL_TYPE['all_element']];

    console.time('virtual dom tree build');
    while ((curNode = tokenArr.pop())) {
        // 构建DOM树
        if (curNode.position === 1) {                                                                       // 开标签
            if (!filterChildren(tokenArr, curNode, filterChild)) {                                          // curNode是否是父节点允许的子节点类型
                continue;
            }
            stack.push(curNode);
            parNode = curNode;
            filterChild = TOKEN_RULE[parNode.type].filterRule.children;

        } else if (curNode.position === 2) {                                                                // 闭标签
            if (curNode.type !== stack[stack.length - 1].type) {
                throw new Error(`opening tag ${stack[stack.length - 1].tag}, closing tag ${curNode.tag}`);
            }
            curNode = stack.pop();
            parNode = stack[stack.length - 1];

            children = curNode.children;
            childrenLen = children ? children.length : 0;
            if (childrenLen > 0) children[childrenLen - 1]['isLast'] = true;                                // 给最后一个子节点添加标记

            filterChild = TOKEN_RULE[parNode.type].filterRule.children;

            if (GLOBAL_CONFIG.excludeElement[curNode.type]) {                                               // 当前节点为注释节点跳过
                if (GLOBAL_CONFIG.excludeElement[curNode.type].option === 2) continue;
            }
            if (!parNode.children) parNode.children = [];

            curNode['parentNode']   = parNode;
            curNode['index']        = parNode.children.length;

            parNode.children.push(curNode);
        } else if (curNode.position === 3) {                                                                // 空标签或文本节点
            if (!parNode.children) parNode.children = [];

            curNode['parentNode']   = parNode;
            curNode['index']        = parNode.children.length;

            parNode.children.push(curNode);
        }

        // 设置是否属于代码块的标识
        try {
            if (curNode.type === EL_TYPE['pre'] ||
                curNode.type === EL_TYPE['code'] ||
                (curNode.parentNode && curNode.parentNode.isCode)) {
                curNode['isCode'] = true;
            }
        } catch (e) {
            console.error('asd', e, curNode, curNode.parentNode);
        }

    }
    console.timeEnd('virtual dom tree build');
    return rootNode;
}

/**
 * 判断该节点（node）是否符合过滤条件（filterRule）
 * @param tokens
 * @param node
 * @param filterRule
 * @returns {boolean}
 */
function filterChildren(tokens, node, filterRule) {

    let rule = filterRule, filter;
    if (!Array.isArray(filterRule)) {
        rule = filterRule.include;
        filter = filterRule.filter;
    }

    if (rule.includes(EL_TYPE['all_element']) || rule.includes(node.type)) return true;

    filterTag(tokens, node, rule, filter);

    return false;
}

/**
 * 将curNode子节点中符合规则（rule）的token过滤掉
 * @param tokenArr
 * @param curNode
 * @param rule
 * @param filter    - 是否只过滤符合rule的节点
 *                  - true: 只过滤符合rule的节点
 *                  - false: 过滤所有子节点
 */
function filterTag(tokenArr, curNode, rule, filter = false) {
    let node, sameCount = 0, start = tokenArr.length, end = start;
    if (filter) {
        for (let i = tokenArr.length; i--;) {
            node = tokenArr[i];
            start = i + 1;
            if (rule.includes(node.type)) {
                tokenArr.splice(start, end - start);
                end = i;
            }
            if (node.type === curNode.type) {
                if (node.position === 1) sameCount++;
                else if (sameCount === 0) {
                    tokenArr.splice(i, end - i);
                    break;
                }
                else sameCount--;
            }
        }
    } else {
        for (let i = tokenArr.length; i--;) {
            node = tokenArr[i];
            if (node.type === curNode.type) {
                if (node.position === 1) sameCount++;
                else if (sameCount === 0) {
                    tokenArr.splice(i);
                    break;
                }
            }
        }
    }
}

export {
    VDOMTree
}
