import path from 'path';
import fs from 'fs';

import yargs from 'yargs';
import cliProgress, { Presets } from 'cli-progress';
import svg2imgWithCallback, { svg2imgOptions } from 'svg2img';

const svg2img = (svg: string, options?: svg2imgOptions): Promise<any> =>
  new Promise((resolve, reject) =>
    svg2imgWithCallback(svg, options, (err, buffer) => {
      if (err) {
        reject(err);
      }
      resolve(buffer);
    })
  );

interface RunArgs {
  indir: string;
  outdir: string;
  newOnly?: boolean;
  size: number;
}

const DEFAULT_SIZE = 256;

const run = async ({
  indir,
  outdir,
  newOnly = false,
  size = DEFAULT_SIZE,
}: RunArgs) => {
  const svgDirectory = path.resolve('.', indir);
  const svgs = fs
    .readdirSync(svgDirectory)
    .filter((filename) => filename.endsWith('.svg'));

  const pngDirectory = path.resolve(outdir);
  if (!fs.existsSync(pngDirectory)) {
    fs.mkdirSync(pngDirectory, { recursive: true });
  }

  const existingPngs = fs
    .readdirSync(pngDirectory)
    .filter((filename) => filename.endsWith('.png'));

  const svgsToProcess = newOnly
    ? svgs.filter(
        (filename) => !existingPngs.includes(filename.replace('svg', 'png'))
      )
    : svgs;

  if (svgsToProcess.length === 0) {
    console.log('No new SVGs found to process.');
    return;
  }

  const progress = new cliProgress.MultiBar({}, Presets.shades_classic);
  const progressBar = progress.create(svgsToProcess.length, 0);

  for (let i = 0; i < svgsToProcess.length; i++) {
    const svgFilename = svgsToProcess[i];
    const svgPath = path.resolve(svgDirectory, svgFilename);
    const pngFilename = svgFilename.replace('svg', 'png');
    const pngPath = path.resolve(pngDirectory, pngFilename);

    const buffer = await svg2img(svgPath, {
      resvg: {
        fitTo: {
          mode: 'width',
          value: size,
        },
      },
    });

    fs.writeFileSync(pngPath, buffer);
    progress.log(`${svgFilename} -> ${pngFilename}\n`);
    progressBar.increment();
  }

  progress.remove(progressBar);
  progress.stop();
};

const gitignorePath = path.resolve('.', '.gitignore');
const gitignoreItems = fs.readFileSync(gitignorePath, 'utf-8').split('\n');

const parentDir = path.resolve('.');
const directories = fs
  .readdirSync(parentDir)
  .filter((filename) => fs.statSync(filename).isDirectory())
  .filter((filename) => !gitignoreItems.includes(filename))
  .filter((name) => !name.startsWith('.') && name !== 'scripts');

const argv = yargs(process.argv)
  .option('indir', {
    alias: 'i',
    type: 'string',
    description: 'Input directory containing SVGs',
    choices: directories,
    demandOption: true,
  })
  .option('outdir', {
    alias: 'o',
    type: 'string',
    description: 'Output directory to save PNGs into',
    demandOption: true,
  })
  .option('newOnly', {
    alias: 'n',
    type: 'boolean',
    description:
      "Only generate PNGs for SVGs that don't already have a PNG version",
  })
  .option('size', {
    alias: 's',
    type: 'number',
    description: 'The size to generate PNGs at, in pixels',
    default: DEFAULT_SIZE,
  })
  .parseSync();

run(argv);
