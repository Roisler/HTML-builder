const fs = require('fs/promises');
const path = require('path');

const copyFiles = async (srcDirectory, destDirectory) => {
  try {
    const srcDirectoryPath = path.join(__dirname, srcDirectory);
    const destDirectoryPath = path.join(__dirname, destDirectory);

    await fs.mkdir(destDirectoryPath, { recursive: true });
    const files = await fs.readdir(srcDirectoryPath);

    for (const file of files) {
      const srcFilePath = path.join(srcDirectoryPath, file);
      const destFilePath = path.join(destDirectoryPath, file);
      await fs.copyFile(srcFilePath, destFilePath);
    }
  } catch (err) {
    console.log(err);
  }
};

copyFiles('files', 'files-copy');
