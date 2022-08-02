// Create github actions file

import { call } from './helpers.js';
import { getSetting } from './settings.js';
import fs from 'fs';

export const createDokkuGithubActionFile = () => {
  call('mkdir -p ./.github/workflows');
  const ssh = getSetting('ssh');
  const app = getSetting('dokkuApp');
  fs.writeFileSync(
    `./.github/workflows/dokku-deploy.yml`,
    `on:
  push:
    branches:
      - main

name: Publish to dokku
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - name: Cloning repo
      uses: actions/checkout@master
      with:
        fetch-depth: 0
    - name: Deploy to dokku
      uses: dokku/github-action@master
      with:
        branch: main
        git_remote_url: 'ssh://dokku@${ssh.split('@')[1]}/${app}'
        ssh_private_key: \${{ secrets.SSH_PRIVATE_KEY }}

`
  );

  console.log(`Go to ${getSetting('githubUrl')}/settings/secrets/actions and set SSH_PRIVATE_KEY. And set the following:`)
  const key = call('cat ~/.ssh/github-actions', true)
  console.log(key)
};
