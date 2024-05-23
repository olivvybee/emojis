import path from 'path';
import fs from 'fs';

import { getOctokit, context } from '@actions/github';
import { setOutput } from '@actions/core';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  throw new Error('process.env.GITHUB_TOKEN is required');
}

const GITHUB_REF = process.env.GITHUB_REF;
if (!GITHUB_REF) {
  throw new Error('process.env.GITHUB_REF is required');
}

const tagName = GITHUB_REF.replace('refs/tags/', '');

const repoUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}`;
const previewUrl = `${repoUrl}/releases/download/${tagName}/preview.png`;

const buildRelaseNotes = (changeList: string, hasPreview: boolean) => `
<details>
<summary>
<h2>Changes in this release</h2>
</summary>

${changeList}
</details>

*See the [README](${repoUrl}) for usage instructions.*

${
  hasPreview
    ? `![A grid of emojis that were changed in this release](${previewUrl})`
    : ''
}
`;

const run = async () => {
  const octokit = getOctokit(GITHUB_TOKEN);

  const { data: releases } = await octokit.rest.repos.listReleases({
    ...context.repo,
  });
  const nonPrereleaseReleases = releases.filter(
    (release) => !release.prerelease
  );
  if (!nonPrereleaseReleases.length) {
    console.log('No non-prerelease releases found to compare against.');
    setOutput('hasSvgChanges', false);
    return;
  }
  const previousTag = nonPrereleaseReleases[0].tag_name;

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

  const commitMessages = changes.commits.map((commit) => commit.commit.message);
  const changeList = commitMessages.map((message) => `- ${message}`).join('\n');
  const releaseNotes = buildRelaseNotes(changeList, changedSvgs.length > 0);
  setOutput('releaseNotes', releaseNotes);

  if (!changedSvgs.length) {
    console.log('No changes to SVGs found since previous release.');
    setOutput('hasSvgChanges', false);
    return;
  }

  const normalisedRef = GITHUB_REF.replace('refs/tags/', '')
    .split('/')
    .join('-');

  const changesDir = path.resolve('.', `updates-${normalisedRef}`);
  fs.mkdirSync(changesDir, { recursive: true });

  changedSvgs.forEach((filePath) => {
    const filename = filePath.slice(filePath.lastIndexOf('/'));
    const srcPath = path.resolve('.', filePath);
    const destPath = path.join(changesDir, filename);
    fs.copyFileSync(srcPath, destPath);
  });

  setOutput('hasSvgChanges', true);
};

run();
