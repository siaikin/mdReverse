# mdReverse
Convert HTML to Markdown. Written by JavaScript.

[Demo](https://abc1310054026.github.io/mdReverse/)

* [development schedule](development.md)
* [For more information see Chinese](README_EN.md)
## Installation
npm:
```
npm install md-reverse
```
## Usage
###### ES6 Modules
```javascript
import {MdReverse} from 'md-reverse';

const mdReverse = new MdReverse();
mdReverse.toMarkdown(`<h1>Hello World!</h1>`);
```
###### ES5
```javascript
var MR = require('md-reverse');
var mdReverse = new MR.MdReverse();
mdReverse.toMarkdown(`<h1>Hello World!</h1>`);
```
