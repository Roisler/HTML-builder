const fsp = require('fs/promises');
const path = require('path');

const copyFiles = async (srcDirectory, destDirectory) => {
  try {
    const srcDirectoryPath = path.join(__dirname, srcDirectory);
    const destDirectoryPath = path.join(__dirname, destDirectory);

    await fsp.mkdir(destDirectoryPath, { recursive: true });
    const existFilesDestFirectory = await fsp.readdir(destDirectoryPath);

    for (const existFile of existFilesDestFirectory) {
      fsp.unlink(path.join(destDirectoryPath, existFile), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    const files = await fsp.readdir(srcDirectoryPath);

    for (const file of files) {
      const srcFilePath = path.join(srcDirectoryPath, file);
      const destFilePath = path.join(destDirectoryPath, file);
      await fsp.copyFile(
        srcFilePath,
        destFilePath,
        fsp.constants.COPYFILE_FICLONE,
      );
    }
  } catch (err) {
    console.log(err);
  }
};

copyFiles('files', 'files-copy');
