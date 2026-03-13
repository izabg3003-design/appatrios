import fs from 'fs';
const data = fs.readFileSync('./public/logo-v3.png');
fs.writeFileSync('./logo-base64.txt', data.toString('base64'));
