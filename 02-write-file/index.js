const fs = require('fs');
const process = require('process');
const readline = require('readline');
const path = require('path');

const writeStream = fs.createWriteStream(path.join(__dirname, '02-write-file'));
const rl = readline.createInterface(process.stdin, process.stdout);

const endWrite = () => {
  console.log('Спасибо за проверку задания!');
  rl.close();
};

rl.setPrompt(
  'Пожалуйста, введите текст, который должен быть записан в файл:\n',
);
rl.prompt();

rl.on('line', (text) => {
  if (text === 'exit') {
    endWrite();
  } else {
    writeStream.write(`${text}\n`);
  }
});

rl.on('SIGINT', endWrite);
