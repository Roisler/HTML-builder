const fsp = require('fs/promises');
const path = require('path');
const { stat } = require('fs');

const directoryPath = path.join(__dirname, 'secret-folder');

const getFilesOfDirectory = async (dirpath) => {
  try {
    const files = await fsp.readdir(dirpath, { withFileTypes: true });
    for (const file of files) {
      const filePath = path.join(directoryPath, file.name);
      const fileExtension = path.extname(file.name);
      const fileBaseName = path.basename(file.name, fileExtension);
      stat(filePath, (err, stats) => {
        if (err) {
          throw err;
        }
        if (stats.isFile()) {
          const { size } = stats;
          const delimiter = '-';
          console.log(
            fileBaseName,
            delimiter,
            fileExtension.slice(1),
            delimiter,
            size,
            'bytes',
          );
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

getFilesOfDirectory(directoryPath);
