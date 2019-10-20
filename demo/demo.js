const mdReserve = new MdReverse();

mdReserve.use(new MdReverse.TablePlugin());
const htmlArea  = document.getElementById('html-area');
const mdArea    = document.getElementById('markdown-area');

let md;
htmlArea.addEventListener('input', (ev) => {
    md = mdReserve.toMarkdown(htmlArea.value);
    mdArea.value = md;
});
