import path from 'path';
import fs from 'fs';
import { createCanvas, Image } from 'canvas';
import yargs from 'yargs';

const MAX_COLUMNS = 10;
const EMOJI_SIZE = 256;
const SPACE_PER_EMOJI = 300;
const SPACING = SPACE_PER_EMOJI - EMOJI_SIZE;

const generateForDir = (dirPath: string, outPath: string) => {
  const filenames = fs
    .readdirSync(dirPath)
    .filter((filename) => filename.endsWith('.png'));

  const rows = Math.ceil(filenames.length / MAX_COLUMNS);
  const columns = rows === 1 ? filenames.length : MAX_COLUMNS;

  const height = rows * SPACE_PER_EMOJI;
  const width = columns * SPACE_PER_EMOJI;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#cfb0eb';
  ctx.fillRect(0, 0, width, height);

  filenames.forEach((filename, index) => {
    const filePath = path.join(dirPath, filename);

    const x = (index % MAX_COLUMNS) * SPACE_PER_EMOJI + SPACING / 2;
    const y = Math.floor(index / MAX_COLUMNS) * SPACE_PER_EMOJI + SPACING / 2;

    const fileData = fs.readFileSync(filePath);
    const image = new Image();
    image.onload = () => {
      ctx.drawImage(image, x, y);
    };
    image.src = fileData;
    image.width = EMOJI_SIZE;
  });

  const output = canvas.toBuffer();

  fs.writeFileSync(outPath, output);
};

const { onlyUpdates } = yargs(process.argv)
  .option('only-updates', {
    type: 'boolean',
    description:
      'Only create an image for the directory containing updated emojis',
  })
  .parseSync();

const pngDirectory = path.resolve('.', 'png');
if (!fs.existsSync(pngDirectory)) {
  throw new Error('png directory does not exist');
}

const pngDirs = fs
  .readdirSync(pngDirectory)
  .filter((filename) =>
    fs.statSync(path.join(pngDirectory, filename)).isDirectory()
  );

const updatesDirName = pngDirs.find((filename) =>
  filename.startsWith('updates')
);

if (onlyUpdates) {
  if (!updatesDirName) {
    throw new Error('No updates directory found');
  }

  const updatesDir = path.join(pngDirectory, updatesDirName);
  const outPath = path.resolve('.', 'preview.png');
  generateForDir(updatesDir, outPath);

  process.exit(0);
}

const outputDir = path.resolve('.', 'previews');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

pngDirs.forEach((dirName) => {
  const dirPath = path.join(pngDirectory, dirName);
  const outPath = path.join(outputDir, `preview-${dirName}.png`);
  generateForDir(dirPath, outPath);
});
