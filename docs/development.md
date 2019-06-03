# 实现过程
**详细开发文档见[HTML逆向解析生成Markdown —— 之一](./devSummary.md)**
## 词法分析
1.  接收原始HTML文本
2.  分割HTML元素：`opening tag` `enclosed text content` `closing tag`（[按照HTML元素的语法](https://developer.mozilla.org/zh-CN/docs/Glossary/HTML)）
    分割结果为数组，按分割顺序储存。
    ```html
    <div>
        <p>Hello</p>
        <p><a href="http://github.com">github</a></p>
    </div>
    ```   
    **result**: `['<div>', '<p>', 'Hello', '</p>', '<p>', '<a href="http://github.com">', 'github', '</a>', '</p>']`
3. 输出结果
## 语法分析
1.  将语法分析的结果`result`转换为`Token`数组
    ```typescript
    // Token定义
    let Token: {
        tag: string,                // token的HTML类型
        type: number,               // token的数字类型
        attribute: {                // 元素的属性名和属性值的集合
            [key: string]: string
        },
        position: number            // Token是开标签还是闭标签（开标签: 1, 闭标签: 2, 空元素: 3）
    }
    ```
    **Token（转换结果示例如下）**:
    ```js
    let Token = [
        {
            tag: 'div',
            type: 1,
            attribute: null,
            position: 1
        },
        ...
    ]
    ```
## 中间代码生成(Virtual DOM Tree)
1.  定义各个HTML元素类型对应的**标识符(type(numer类型))，允许的子元素类型，允许保留的属性**。
2.  接收词法分析的结果，将其转换成类似`DOM Tree`树形结构。
    树节点类型如下:
    ```typescript
    // Node定义
    let Node: {
        type: number,               // token类型
        attribute: {                // 元素的属性名和属性值的集合
            [key: string]: string
        },
        content: string | Array,    // token内容，文本节点为string，非空元素如有子节点为数组，空元素为null
        isHTML: boolean,            // 标识是否显示为HTML内容
        isCode: boolean             // 标识是否显示为计算机代码
    }
    ```
3.  遍历树，确保结构正确。
4.  输出结果
## 目标代码生成(Markdown Text)
1.  定义各个HTML元素类型对应的**开标签转换规则，闭标签转换规则**。
2.  接收中间代码。
3.  按照开闭标签的转换规则生成目标代码。
# to-do List

- [x] 词法分析
- [x] 语法分析
- [x] 中间代码生成
- [x] 目标代码生成
- [ ] 完成插件模块
    - [ ] Markdown扩展语法
        - [ ] Tables
        - [ ] Code Syntax Highlighting
        - [ ] Footnotes
        - [ ] Heading IDs
        - [ ] Definition Lists
        - [ ] Strikethrough
        - [ ] Task Lists
        - [ ] Automatic URL Linking
