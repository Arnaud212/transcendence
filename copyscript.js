const fs = require('fs');
const path = require('path');

const bootstrapCssSrc = path.join(__dirname, 'node_modules/bootstrap/dist/css/bootstrap.min.css');
const bootstrapJsSrc = path.join(__dirname, 'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js');

const staticCssDest = path.join(__dirname, 'static/css/bootstrap.min.css');
const staticJsDest = path.join(__dirname, 'static/js/bootstrap.bundle.min.js');

try {
    fs.mkdirSync(path.dirname(staticCssDest), { recursive: true });
    fs.mkdirSync(path.dirname(staticJsDest), { recursive: true });

    fs.copyFileSync(bootstrapCssSrc, staticCssDest);
    fs.copyFileSync(bootstrapJsSrc, staticJsDest);

    console.log('Bootstrap files copied to static directory');
} catch (err) {
    console.error('Error copying Bootstrap files:', err);
}
