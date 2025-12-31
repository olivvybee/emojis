import path from 'path';
import fs from 'fs';

const run = async () => {
  const pngDir = path.resolve('.', 'png');
  const directories = fs
    .readdirSync(pngDir)
    .filter((filename) =>
      fs.statSync(path.resolve(pngDir, filename)).isDirectory(),
    );

  const links = directories
    .map((directory) => `<li><a href="${directory}">${directory}</a></li>`)
    .join('\n');

  const indexTemplatePath = path.resolve(
    '.',
    'scripts',
    'generateHTMLIndexes',
    'index-template.html',
  );
  const indexTemplate = fs.readFileSync(indexTemplatePath, 'utf-8');

  const output = indexTemplate.replace('{{ links }}', links);
  const outputPath = path.resolve(pngDir, 'index.html');
  fs.writeFileSync(outputPath, output);

  directories.forEach((directory) => {
    const directoryPath = path.resolve(pngDir, directory);

    const emojis = fs
      .readdirSync(directoryPath)
      .filter((name) => name.endsWith('.png'));

    const emojiLinks = emojis
      .map((filename) => {
        const emojiName = filename.replace('.png', '');
        return `<li><a href="${filename}">${emojiName}</a></li>`;
      })
      .join('\n');

    const folderTemplatePath = path.resolve(
      '.',
      'scripts',
      'generateHTMLIndexes',
      'folder-template.html',
    );
    const folderTemplate = fs.readFileSync(folderTemplatePath, 'utf-8');

    const output = folderTemplate
      .replace('{{ name }}', directory)
      .replace('{{ name }}', directory)
      .replace('{{ links }}', emojiLinks);
    const outputPath = path.resolve(directoryPath, 'index.html');
    fs.writeFileSync(outputPath, output);
  });
};

run();
