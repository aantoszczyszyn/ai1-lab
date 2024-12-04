const msg = "Hello!";
alert(msg);
function loadStyleSheet(sheetPath) {
    const existingLink = document.querySelector('link[rel="stylesheet"][id="dynamic-style"]');
    if (existingLink) {
        existingLink.href = sheetPath;
    } else {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = sheetPath;
        link.id = 'dynamic-style';
        document.head.appendChild(link);
    }
}

loadStyleSheet('css/page1.css');

const styles = [
    { name: 'Styl 1', path: 'css/page1.css' },
    { name: 'Styl 2', path: 'css/page2.css' },
];

function createStyleLinks() {
    const container = document.createElement('div');
    container.id = 'style-links';
    container.style.margin = '20px';

    styles.forEach(style => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = style.name;
        link.style.marginRight = '10px';
        link.onclick = (e) => {
            e.preventDefault();
            loadStyleSheet(style.path);
        };
        container.appendChild(link);
    });

    document.body.insertBefore(container, document.body.firstChild);
}

createStyleLinks();
