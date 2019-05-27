// import {MdReserve} from 'md-reserve';
var MR = require('md-reverse');
// css file
import './styles.css';

const mdReserve = new MR.MdReverse();

const htmlArea  = document.getElementById('html-area');
const mdArea    = document.getElementById('markdown-area');

let md;
htmlArea.addEventListener('input', (ev) => {
    md = mdReserve.toMarkdown(htmlArea.value);
    mdArea.value = md;
});
