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
    let origContent = content;

    // Remove className from <thead tr>
    // Just find <thead...> <tr> and <tr className="...">
    content = content.replace(/<thead[^>]*>\s*<tr[^>]*>/g, (match) => {
        return match.replace(/<tr[^>]*>/, '<tr>');
    });

    // Replace <tr className="..."> in tbody with the standard
    content = content.replace(/<tr\s+[^>]*className=\{?`?[^>]*\n?[^>]*\}?>/g, (match) => {
        if (match.includes('<thead')) return match; // skip if it's somehow matching thead
        
        let isPointer = match.includes('cursor-pointer') || match.includes('onClick');
        let keyMatch = match.match(/key=\{[^}]*\}/) || match.match(/key="[^"]*"/);
        let keyStr = keyMatch ? ` ${keyMatch[0]}` : '';
        let onClickMatch = match.match(/onClick=\{[^}]*\}/);
        let onClickStr = onClickMatch ? ` ${onClickMatch[0]}` : '';
        
        let baseClass = "even:bg-gray-50 odd:bg-white hover:bg-red-50 transition-colors";
        if (isPointer && !baseClass.includes('cursor-pointer')) {
            baseClass += " cursor-pointer";
        }
        
        return `<tr${keyStr}${onClickStr} className="${baseClass}">`;
    });

    // Fallback: Some tr might not have matched if they don't have className but have key
    content = content.replace(/<tbody>\s*(?:\{[^}]*\})?\s*(?:.*\.map\([^=]*=>\s*\(\s*)?<tr([^>]*)>/g, (match, attrs) => {
        if (!attrs.includes('className')) {
            return match.replace(/<tr([^>]*)>/, `<tr$1 className="even:bg-gray-50 odd:bg-white hover:bg-red-50 transition-colors">`);
        }
        return match;
    });

    if (content !== origContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated TR in ${file}`);
    }
});
