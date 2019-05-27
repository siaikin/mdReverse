# mdReserve
将HTML文本转换为Markdown格式文本。由JavaScript编写

[Demo](https://abc1310054026.github.io/mdReverse/)

* [开发进度](./development.md)
* [English Version](./README_EN.md)
## 安装
npm:
```
npm install md-reserve
```
## 用法
###### ES6 Modules
```javascript
import {MdReverse} from 'md-reverse';

const mdReserve = new MdReverse();
mdReserve.toMarkdown(`<h1>Hello World!</h1>`);
```
###### ES5
```javascript
var MR = require('md-reverse');
var mdReserve = new MR.MdReverse();
mdReserve.toMarkdown(`<h1>Hello World!</h1>`);
```
## 提示
*   因为各个网站的网页结构千奇百怪，做不到匹配所有网站，建议转换的HTML文本本身就是由Markdown编写的或符合Markdown规范。
    在转换非Markdown规范的HTML文本可能准确性会大大下降。
*   目前仅能支持Markdown的[基本语法](https://www.markdownguide.org/basic-syntax)。[扩展语法](https://www.markdownguide.org/extended-syntax)部分会在之后陆续完成。
*   为了提高转换的准确性，对于无法识别的HTML标签，`md-reserve`会将其删除。这个问题在扩展语法部分完成后会尝试解决。
