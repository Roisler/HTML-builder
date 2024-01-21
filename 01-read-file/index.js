const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

const stream = fs.createReadStream(filePath, { encoding: 'UTF-8' });

stream.on('data', (data) => console.log(data));
