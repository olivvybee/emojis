import path from 'path';
import fs from 'fs';

import yargs from 'yargs';
import cliProgress, { Presets } from 'cli-progress';

import { getSvgDirectories, svg2img } from './utils.js';
import { svg2imgOptions } from 'svg2img';

const DEFAULT_SIZE = 256;
const ALL_DIRECTORIES = getSvgDirectories();

const convertSvg = (svg: string, options?: svg2imgOptions): Promise<any> =>
  new Promise((resolve, reject) =>
    svg2img(svg, options, (err, buffer) => {
      if (err) {
        reject(err);
      }
      resolve(buffer);
    })
  );

interface GenerateArgs {
  svgPath: string;
  pngPath: string;
  size: number;
}

const generate = async ({ svgPath, pngPath, size }: GenerateArgs) => {
  const buffer = await convertSvg(svgPath, {
    resvg: {
      fitTo: {
        mode: 'width',
        value: size,
      },
    },
  });

  fs.writeFileSync(pngPath, buffer);
};

const getParamsForSvgs = (
  svgDir: string,
  pngDir: string,
  size: number
): GenerateArgs[] => {
  const svgs = fs
    .readdirSync(svgDir)
    .filter((filename) => filename.endsWith('.svg'));

  if (!fs.existsSync(pngDir)) {
    fs.mkdirSync(pngDir, { recursive: true });
  }

  return svgs.map((filename) => ({
    svgPath: path.resolve(svgDir, filename),
    pngPath: path.resolve(pngDir, filename.replace('.svg', '.png')),
    size,
  }));
};

interface RunArgs {
  directories?: string[];
  size?: number;
}

const run = async ({
  directories = ALL_DIRECTORIES,
  size = DEFAULT_SIZE,
}: RunArgs) => {
  const generationParams = directories.flatMap((dir) => {
    const svgDir = path.resolve('.', dir);
    const pngDir = path.resolve(
      '.',
      'png',
      size === DEFAULT_SIZE ? dir : `${dir}-${size}`
    );
    return getParamsForSvgs(svgDir, pngDir, size);
  });

  const progress = new cliProgress.MultiBar({}, Presets.shades_classic);
  const progressBar = progress.create(generationParams.length, 0);

  for (const params of generationParams) {
    await generate(params);
    progress.log(
      `${params.svgPath.split('/').at(-1)} -> ${params.pngPath
        .split('/')
        .at(-1)}\n`
    );
    progressBar.increment();
  }

  progress.remove(progressBar);
  progress.stop();
};

const argv = yargs(process.argv)
  .option('directories', {
    alias: 'd',
    type: 'string',
    description: 'Input directories containing SVGs',
    array: true,
    choices: ALL_DIRECTORIES,
  })
  .option('size', {
    alias: 's',
    type: 'number',
    description: 'The size to generate PNGs at, in pixels',
    default: DEFAULT_SIZE,
  })
  .parseSync();

run(argv);
