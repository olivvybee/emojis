import path from 'path';
import fs from 'fs';

const baseMeta = {
  metaVersion: 2,
  host: 'beehive.gay',
  exportedAt: new Date().toISOString(),
};

const pngDirectory = path.resolve('.', 'png');

if (!fs.existsSync(pngDirectory)) {
  throw new Error('png directory does not exist');
}

const directories = fs
  .readdirSync(pngDirectory)
  .filter((filename) => fs.statSync(filename).isDirectory());

directories.forEach((directory) => {
  const dirPath = path.resolve(pngDirectory, directory);
  const filenames = fs
    .readdirSync(dirPath)
    .filter((filename) => filename.endsWith('.png'));

  const emojis = filenames.map((filename) => {
    const name = filename.replace('.png', '');

    return {
      downloaded: true,
      fileName: filename,
      emoji: {
        name,
        category: directory,
        aliases: [],
      },
    };
  });

  const meta = {
    ...baseMeta,
    emojis,
  };

  const outPath = path.resolve(dirPath, 'meta.json');
  fs.writeFileSync(outPath, JSON.stringify(meta, null, 2));
});
