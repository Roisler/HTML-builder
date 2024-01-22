const fsp = require('fs/promises');
const path = require('path');
const fs = require('fs');

const regexTags = /{{[a-zA-Z0-9]*}}/gm;
const regexDeleteBrace = /[^a-zA-Z0-9]/gm;

const getComponents = async (dirpath) => {
  const componentsName = await fsp.readdir(dirpath);

  const componentsWithContent = {};

  for (const componentName of componentsName) {
    const componentPath = path.join(dirpath, componentName);
    const componentBaseName = path.basename(
      componentPath,
      path.extname(componentPath),
    );
    const componentContent = await fsp.readFile(componentPath, {
      encoding: 'utf-8',
    });

    componentsWithContent[componentBaseName] = componentContent.trimEnd();
  }
  return componentsWithContent;
};

const mergeStyles = async (dirpath, outputFilePath) => {
  try {
    const stylesArray = [];
    const files = await fsp.readdir(dirpath);
    for (const file of files) {
      const fileExtension = path.extname(file);
      if (fileExtension === '.css') {
        const filepath = path.join(dirpath, file);
        const content = await fsp.readFile(filepath);
        stylesArray.push(content);
      }
    }

    await fsp.writeFile(outputFilePath, '');
    const stylesString = stylesArray.join('\n');
    await fsp.appendFile(outputFilePath, stylesString);
  } catch (err) {
    console.log(err);
  }
};

const replaceHtml = async (template, newDirectoryPath) => {
  await fsp.mkdir(newDirectoryPath, { recursive: true });

  const components = await getComponents(path.join(__dirname, 'components'));
  const content = await fsp.readFile(template, { encoding: 'utf-8' });

  const tagsMatches = content.match(regexTags);
  const tags = [];
  for (const tag of tagsMatches) {
    tags.push(tag.replace(regexDeleteBrace, ''));
  }

  const replaceContent = (content, i = 0) => {
    if (i === tagsMatches.length) {
      return content;
    }
    const replaceStr = content.replace(tagsMatches[i], components[tags[i]]);
    i += 1;
    return replaceContent(replaceStr, i);
  };

  const newContent = replaceContent(content);
  await fsp.writeFile(path.join(newDirectoryPath, 'index.html'), newContent);
};

const copyFiles = async (srcDirectory, destDirectory) => {
  try {
    await fsp.rm(destDirectory, { force: true, recursive: true });
    await fsp.mkdir(destDirectory, { recursive: true });

    const data = await fsp.readdir(srcDirectory);

    for (const item of data) {
      const srcItemPath = path.join(srcDirectory, item);
      const destItemPath = path.join(destDirectory, item);
      fs.stat(srcItemPath, { withFileTypes: true }, async (err, stats) => {
        if (err) {
          throw err;
        }
        if (stats.isDirectory()) {
          copyFiles(srcItemPath, destItemPath);
        } else {
          await fsp.copyFile(
            srcItemPath,
            destItemPath,
            fsp.constants.COPYFILE_FICLONE,
          );
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const buildPage = async (template, outputDir) => {
  await copyFiles(
    path.join(__dirname, 'assets'),
    path.join(__dirname, outputDir, 'assets'),
  );

  await mergeStyles(
    path.join(__dirname, 'styles'),
    path.join(__dirname, outputDir, 'style.css'),
  );

  await replaceHtml(template, path.join(__dirname, outputDir));
};

const templatePath = path.join(__dirname, 'template.html');

buildPage(templatePath, 'project-dist');
