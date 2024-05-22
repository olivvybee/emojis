import path from 'path';
import fs from 'fs';

import { getOctokit, context } from '@actions/github';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  throw new Error('process.env.GITHUB_TOKEN is required');
}

const GITHUB_REF = process.env.GITHUB_REF;
if (!GITHUB_REF) {
  throw new Error('process.env.GITHUB_REF is required');
}

const run = async () => {
  const octokit = getOctokit(GITHUB_TOKEN);

  const { data: releases } = await octokit.rest.repos.listReleases({
    ...context.repo,
  });
  const latestRelease = releases[0];
  const previousTag = latestRelease.tag_name;

  const { data: changes } = await octokit.rest.repos.compareCommits({
    ...context.repo,
    base: previousTag,
    head: GITHUB_REF,
  });
  const files = changes.files || [];

  const changedSvgs = files
    .filter(
      (file) => file.filename.endsWith('.svg') && file.status !== 'removed'
    )
    .map((file) => file.filename);

  const normalisedRef = GITHUB_REF.replace('refs/tags/', '')
    .split('/')
    .join('-');
  const changesDir = path.resolve('.', `updates-${normalisedRef}`);
  console.log(changesDir);
  fs.mkdirSync(changesDir, { recursive: true });

  changedSvgs.forEach((filePath) => {
    const filename = filePath.slice(filePath.lastIndexOf('/'));
    const srcPath = path.resolve('.', filePath);
    const destPath = path.join(changesDir, filename);
    fs.copyFileSync(srcPath, destPath);
  });
};

run();
