const mdReverse = new MdReverse();

mdReverse.use(MdReverse.plugin['table']);
mdReverse.use(MdReverse.plugin['strickthrough']);
const htmlArea  = document.getElementById('html-area');
const mdArea    = document.getElementById('markdown-area');

let md;
htmlArea.addEventListener('input', (ev) => {
    md = mdReverse.toMarkdown(htmlArea.value);
    mdArea.value = md;
});
