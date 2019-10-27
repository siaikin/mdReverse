# mdReserve
将HTML文本转换为Markdown格式文本。由JavaScript编写

[Demo](https://siaikin.github.io/mdReverse/)

* [开发进度](docs/development.md)
* [English Version](./docs/README_EN.md)
## 安装
npm:
```
npm install md-reserve
```
script引入:
```html
<script src="../dist/md-reverse.browser.js" type="application/javascript"></script>
```
前往[Github](https://github.com/siaikin/mdReverse/releases/tag/v1.0.0)下载

## 用法

*   [插件开发说明](./docs/pluginDevelopment.md)

###### ES6 Modules
```javascript
import {MdReverse, TablePlugin, StrikethroughPlugin} from "md-reverse";

const mdReserve = new MdReverse();
mdReserve.toMarkdown(`<h1>Hello World!</h1>`);

// 使用插件扩展Table, Strikethrough语法
mdReserve.use(TablePlugin);
mdReserve.use(StrikethroughPlugin);
mdReserve.toMarkdown(`<h1><delHello World!</del></h1>`);

```
###### 原生js
```javascript
const mdReserve = new MdReverse();
mdReserve.toMarkdown(`<h1>Hello World!</h1>`);

// 使用插件扩展Table, Strikethrough语法
mdReserve.use(MdReverse.plugin['table']);
mdReserve.use(MdReverse.plugin['strikethrough']);
mdReserve.toMarkdown(`<h1><delHello World!</del></h1>`);
```

## 支持语法
1. [Markdown基本语法](https://www.markdownguide.org/basic-syntax/)
2. [Table语法](https://www.markdownguide.org/extended-syntax/#tables)
3. [strikethrough语法](https://www.markdownguide.org/extended-syntax/#strikethrough)

## 提示
*   因为各个网站的网页结构千奇百怪，做不到匹配所有网站，建议转换的HTML文本本身就是由Markdown编写的或符合Markdown规范。
    在转换非Markdown规范的HTML文本可能准确性会大大下降。
*   目前仅能支持Markdown的[基本语法](https://www.markdownguide.org/basic-syntax)。[扩展语法](https://www.markdownguide.org/extended-syntax)部分会在之后陆续完成。
*   为了提高转换的准确性，对于无法识别的HTML标签，`md-reserve`会将其删除。这个问题在扩展语法部分完成后会尝试解决。
