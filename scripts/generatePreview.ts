import path from 'path';
import fs from 'fs';
import { createCanvas, Image } from 'canvas';

const MAX_COLUMNS = 10;
const EMOJI_SIZE = 256;
const SPACE_PER_EMOJI = 300;
const SPACING = SPACE_PER_EMOJI - EMOJI_SIZE;

const pngDirectory = path.resolve('.', 'png');
if (!fs.existsSync(pngDirectory)) {
  throw new Error('png directory does not exist');
}

const updatesDirName = fs
  .readdirSync(pngDirectory)
  .filter((filename) =>
    fs.statSync(path.join(pngDirectory, filename)).isDirectory()
  )
  .find((filename) => filename.startsWith('updates'));

if (!updatesDirName) {
  throw new Error('No updates directory found');
}

const updatesDir = path.join(pngDirectory, updatesDirName);

const filenames = fs
  .readdirSync(updatesDir)
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
  const filePath = path.resolve(updatesDir, filename);

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
const outPath = path.resolve('.', 'preview.png');

fs.writeFileSync(outPath, output);
