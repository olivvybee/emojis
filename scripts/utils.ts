import path from 'path';
import fs from 'fs';

import svg2imgDefault from 'svg2img';

export const getSvgDirectories = () => {
  const gitignorePath = path.resolve('.', '.gitignore');
  const gitignoreItems = fs.readFileSync(gitignorePath, 'utf-8').split('\n');

  const parentDir = path.resolve('.');
  return fs
    .readdirSync(parentDir)
    .filter((filename) => fs.statSync(filename).isDirectory())
    .filter((filename) => !gitignoreItems.includes(filename))
    .filter((name) => !name.startsWith('.') && name !== 'scripts');
};

export const svg2img =
  svg2imgDefault as unknown as typeof svg2imgDefault.default;
