import {TOKEN_RULE} from "./nwodkramConfig";

function Markdown() {

}

Object.defineProperties(Markdown.prototype, {
    translate: {
        value: translate
    }
});

function translate(vdomt) {
    const stack = [];
    let curNode = vdomt, children, result = '';
    vdomt._pos = 0;
    console.time('markdown text translate');
    while (curNode !== vdomt || curNode.children.length > curNode._pos) {
        if (curNode.position === 1) {                                   // 非空元素
            children = curNode.children;

            if (curNode !== stack[stack.length - 1]) {                  // curNode在栈顶不存在，说明curNode是第一次被执行
                curNode['_pos'] = 0;
                stack.push(curNode);                                    // 第一次执行将其加入栈中
                result += convertToken(curNode, 'head');
            }
            if (children && children.length > curNode._pos) {           // 非空且有子节点的元素，将子节点取出一个进行下一次循环
                curNode = children[curNode._pos++];                     // 设置下一次循环的节点
            } else {                                                    // 非空无子节点的元素，弹出栈
                stack.pop();
                result += convertToken(curNode, 'tail');

                curNode = stack[stack.length - 1];                      // 设置下一次循环的节点
            }
        } else if (curNode.position === 3) {                            // 空元素或文本节点
            result += convertToken(curNode, 'headtail');

            curNode = stack[stack.length - 1];                          // 设置下一次循环的节点
        }
    }
    console.timeEnd('markdown text translate');

    return result;
}

/**
 *
 * @param node
 * @param pos {'head' | 'tail' | 'headtail'} - 应用开始/结束的转换规则
 */
function convertToken(node, pos) {
    let result, rule = TOKEN_RULE[node.type];
    switch (pos) {
        case 'head':
            let pre = '', parNode = node.parentNode;

            if (parNode && parNode.child_pre) pre += parNode.child_pre;
            if (rule.childNodeRule) {
                pre += rule.childNodeRule.pre ? rule.childNodeRule.pre(node) : '';
            }
            node['child_pre'] = pre;
            return rule.convertRule(node);
        case 'tail':
            // console.log(`[${node.tag}]: ${pos}`);
            return rule.endRule(node);
        case 'headtail':
        default:
            // console.log(`[${node.tag}]: ${pos}`);
            return rule.convertRule(node) + rule.endRule(node);
    }
}

export {
    Markdown
}
