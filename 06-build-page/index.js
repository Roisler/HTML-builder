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

const replaceHtml = async (template) => {
  const newDirectoryPath = path.join(__dirname, 'project-dist');
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

replaceHtml(path.join(__dirname, 'template.html'));
