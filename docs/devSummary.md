# HTML逆向解析生成Markdown —— 之一
解析过程分为四个阶段。以下是各个阶段的简要说明。
1.  分词：将HTML原始文本分割为HTML标签
2.  生成虚拟DOM节点：将分割后的HTML标签转换成对应的节点
3.  构建虚拟DOM树：将节点根据其顺序生成相应的DOM树
4.  生成Markdown文本：根据预先定义HTML To Markdown的转换规则，对DOM树进行转换

```flowchart
st=>start: 源HTML文本
lexer=>operation: 分词
parser=>operation: 生成虚拟DOM节点
filter=>inputoutput: 过滤无效节点
vdomt=>operation: 构建虚拟DOM树
filterAgain=>inputoutput: 根据转换规则再次过滤节点
md=>operation: 生成Markdown文本
ed=>end: 输出Markdown文本

st(right)->lexer->parser->filter->vdomt->filterAgain->md(right)->ed
```
 
**下面这段HTML文本将作为解析的样例文本：**
```html
<h2 id="逆向解析HTMl">逆向解析HTMl</h2>
<p><a href="https://www.baidu.com" rel="nofollow" target="_blank">Markdown</a>解析过程分为四个阶段</p>
<ul>
<li>分词</li>
<li>生成虚拟DOM节点</li>
<li>构建虚拟DOM树</li>
<li><p>生成Markdown文本</p></li>
</ul>
```

## 分词
我们将源HTML文本按照[HTML元素的语法](https://developer.mozilla.org/zh-CN/docs/Glossary/HTML)，分解为`Opening tag` `Closing tag` `Enclosed text content`。
![](https://mdn.mozillademos.org/files/7659/anatomy-of-an-html-element.png)

因为HTML元素内部很可能还有嵌套的元素，所以还要继续分割`Enclosed text content`直到只剩下`文字文本`。

从上图来看很明显，`Opening tag`和`Closing tag`都是由`<` `>`这两个符号包裹的，那我们只需要对愿HTML文本进行一次搜索，将被`<` `>`包裹起来的字符串提取出来，放入一个数组中。搜索结束后数组就是我们分词的结果。
原始文本经过分割后，如下所示：
```javascript
const result = [
  '<h2 id="逆向解析HTMl">',
  '逆向解析HTMl',
  '</h2>',
  '<p>',
  '<a href="https://www.baidu.com" rel="nofollow" target="_blank">',
  'Markdown',
  '</a>',
  '解析过程分为四个阶段',
  '</p>',
  '<ul>',
  '<li>',
  '分词',
  '</li>',
  '<li>',
  '生成虚拟DOM节点',
  '</li>',
  '<li>',
  '构建虚拟DOM树',
  '</li>',
  '<li>',
  '<p>',
  '生成Markdown文本',
  '</p>',
  '</li>',
  '</ul>'
]
```

**需要注意的是，html标签中的属性值是允许出现`<`和`>`这两个符号的**，也就是说会出现类似`<div data-demo="<demo>asd</demo>">`这样的文本。
这里要注意的是不能直接从头到尾搜索`<` `>`然后提取里面的字符串，不然会出现提取到`<div data-demo="<demo>`这样的结果。

##### 我实现的方法比较简单，是利用栈来判断HTML标签的开始和结束。
1. 首先从下标0开始，遍历字符串
2. 
    1.  如果当前的字符是`<`，则将其压入栈中。
    2.  如果当前的字符是`>`，且栈顶是`<`，则表示一个HTML标签的结束。
        然后将开始符号`<`和结束符号`>`之间的字符串提取出来保存到结果数组就好了。
    3.  如果当前的字符是`"`，且栈顶不是`"`，则将其压入栈中。
    4.  如果当前的字符是`"`，且栈顶是`"`，则将栈顶元素弹出。

具体实现见[lexer.js](../src/lib/lexer.js)

## 生成虚拟DOM节点

在这一阶段，主要要对节点的属性的过滤，HTML标签内部的大部分属性都是不需要的。除了`a` `img`等几个HTML元素。
得到分词后的结果之后，就可以解析HTML标签字符串生成一个个包含HTML标签信息的对象。
对象类型如下：
```javascript
const obj = {
    // 固定属性
    tag,            // HTML标签名。如`div`, `span`
    type,           // 自定义的HTML标签名所对应的数字。
    position,       // 标签所在的位置。开始标签（Opening tag）：1，结束标签（Closing tag）：2，空元素（empty tag）和文本节点（text node）：3
    // 可选属性
    attr,           // 标签内属性的键值对，这是一个对象。一些需要保留属性的元素如`a`元素需要保留`href` `title`用来生成Markdown文本。
    content         // 文本节点特有，用来保存文本
}
```
这一过程得到的结果如下（有点多，这里只截取前6个比较有代表性的）：
```javascript
const result = [
    {
        tag: 'h2',
        type: 42,           // 不要在意`type`属性，这是自定义的，42代表`h2`元素对应数字
        position: 1
    },
    {
        tag: 'textNode',
        type: 1,
        position: 3,
        content: '逆向解析HTMl'
    },
    {
        tag: 'h2',
        type: 42,
        position: 2
    },
    {
        tag: 'p',
        type: 6,
        position: 1
    },
    {
        tag: 'a',
        type: 2,
        position: 1,
        attr: {
            href: 'https://www.baidu.com'
        }
    },
    {
        tag: 'textNode',
        type: 1,
        position: 3,
        content: 'Markdown'
    },
]
```
##### 这部分的实现思路也比较简单，大部分是字符串处理。
1.  `tag`：HTML标签的结构很简单，大致就以下几种：（最后一种不需要处理，可以忽略）
    1. `<tagName attrKey="attrValue" attrKey>` `<tagName attrKey="attrValue" attrKey >`
    2. `<tagName/>` `<tagName />`
    3. `</tagName>`
    
    很容易发现要想得到tagName只需要找到在`<`和（`空格`或`/`）之间的字符串就可以了。
2.  `type`：这个属性是为了方便之后的类型处理添加的，毕竟数字相对字符串来说更好处理。
    
    我在配置文件里写了一个映射表（[配置文件](../src/lib/config.js)），以`tag`作为key对应数字作为value。这样就能很方便的对应起来。
3.  `position`：这个属性虽然叫`position`，其实`type`才更适合它，因为它标识了开始标签（Opening tag）：1，结束标签（Closing tag）：2，空元素（empty tag）和文本节点（text node）：3
    
    `position`的判断我写的比较简单，只考虑到了上文`tag`所列的几种情况（但也已经能包括大部分情况了）。从上面那几种情况来说。
    只要判断`tag`开始位置的下标索引是/不是`1`，就能知道是/不是Opening tag了。
    
    关于文本节点的判断：文本节点是没有`tag`的，如果无法搜索到`tag`，就可以将节点标识为文本节点。
4.  `attr`：`attr`里面保存着解析成Markdown文本所需要的一些属性。大多数情况是和链接相关的，比如以下几种：
    1.  Markdown规范中的与链接有关的语法（`Links` `Images` `Heading IDs` `Footnotes`）。
        1.  `Links`：`src` `title`
        2.  `Image`: `src` `title` `alt`
        3.  `Heading IDs`：`id`
        4.  `Footnotes`：`id`
5.  `content`：文本节点不多说了。

具体实现见[parser.js](../src/lib/parser.js)

## 结束
反向解析要详细讲比较繁琐，这是第一部分，预计分三章讲完。

###### PS.
诸位感兴趣的话点个赞或者评论一下，我会比较有动力写。
###### PSS.
~~大三了，最近找实习啊，宁波杭州上海有招前端的吗？~~
宁波可有骑友？请务必联系我
