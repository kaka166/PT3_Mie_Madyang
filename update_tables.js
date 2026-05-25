const fs = require('fs');
const path = require('path');

const dir = './frontend/app/(dashboard)';

function getFiles(d) {
    let results = [];
    const list = fs.readdirSync(d);
    list.forEach(file => {
        const fullPath = path.join(d, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(fullPath));
        } else if (fullPath.endsWith('.tsx')) {
            results.push(fullPath);
        }
    });
    return results;
}

const files = getFiles(dir);

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    if (!content.includes('<table')) return;
    
    // Replace TH padding
    const origContent = content;
    content = content.replace(/<th(\s+)className="([^"]*)"/g, (match, space, classStr) => {
        let newClasses = classStr.replace(/px-[a-zA-Z0-9\.]+/g, '').replace(/py-[a-zA-Z0-9\.]+/g, '').replace(/\s+/g, ' ').trim();
        return `<th${space}className="px-5 py-3 ${newClasses}"`.replace('  ', ' ');
    });

    // Replace TD padding
    content = content.replace(/<td(\s+)className="([^"]*)"/g, (match, space, classStr) => {
        let newClasses = classStr.replace(/px-[a-zA-Z0-9\.]+/g, '').replace(/py-[a-zA-Z0-9\.]+/g, '').replace(/\s+/g, ' ').trim();
        return `<td${space}className="px-5 py-3.5 ${newClasses}"`.replace('  ', ' ');
    });

    if (content !== origContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated padding in ${file}`);
    }
});
