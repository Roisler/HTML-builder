const fsp = require('fs/promises');
//const fs = require('fs');
const path = require('path');

const directoryStylesPath = path.join(__dirname, 'styles');
const bundleFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

const mergeStyles = async (dirpath) => {
  try {
    const stylesArray = [];
    const files = await fsp.readdir(dirpath);
    for (const file of files) {
      const fileExtension = path.extname(file);
      if (fileExtension === '.css') {
        const filepath = path.join(directoryStylesPath, file);
        const content = await fsp.readFile(filepath);
        stylesArray.push(content);
      }
    }

    await fsp.writeFile(bundleFilePath, '');
    const stylesString = stylesArray.join('\n');
    await fsp.appendFile(bundleFilePath, stylesString);
  } catch (err) {
    console.log(err);
  }
};

mergeStyles(directoryStylesPath);
