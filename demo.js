import {MdReverse} from './src/index';
// var MR = require('md-reverse');
// css file
import './styles.css';
import {TablePlugin} from "./src/lib/plugins/table";

const mdReserve = new MdReverse();

mdReserve.use(new TablePlugin());
const htmlArea  = document.getElementById('html-area');
const mdArea    = document.getElementById('markdown-area');

let md;
htmlArea.addEventListener('input', (ev) => {
    md = mdReserve.toMarkdown(htmlArea.value);
    mdArea.value = md;
});
