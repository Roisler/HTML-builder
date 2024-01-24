const fsp = require('fs/promises');
const path = require('path');

const copyFiles = async (srcDirectory, destDirectory) => {
  try {
    const srcDirectoryPath = path.join(__dirname, srcDirectory);
    const destDirectoryPath = path.join(__dirname, destDirectory);

    await fsp.rm(destDirectoryPath, { force: true, recursive: true });
    await fsp.mkdir(destDirectoryPath, { recursive: true });

    const files = await fsp.readdir(srcDirectoryPath, { withFileTypes: true });
    for (const file of files) {
      const srcFilePath = path.join(srcDirectoryPath, file.name);
      const destFilePath = path.join(destDirectoryPath, file.name);
      if (file.isFile()) {
        await fsp.copyFile(
          srcFilePath,
          destFilePath,
          fsp.constants.COPYFILE_FICLONE,
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
};

copyFiles('files', 'files-copy');
