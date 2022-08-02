#! /usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createDokkuGithubActionFile } from './dokku.js';
import { createSettings, createPrettier } from './settings.js';
import { createUmbracoDockerfile, createUmbracoStorage, downloadSyncContent, downloadUmbracoData, uploadUmbracoData } from './umbraco.js';

/*
  Commands:
  ---------
  settings:luna 
  settings:prettier 

  umbraco:dockerfile
  umbraco:downloaddata
  umbraco:uploaddata 
  umbraco:uploadsynccontent
  umbraco:downloadsynccontent
  umbraco:createdokkustorages

  dokku:deploy
  dokku:creategithubaction  
 
  prettier:createconfig
*/

yargs(hideBin(process.argv))
  .command('settings:luna', 'Create .lunarc.json settings file', () => {}, createSettings)
  .command('settings:prettier', 'Create prettierrc and ignore files', () => {}, createPrettier)
  .command('umbraco:dockerfile', 'Create Dockerfile for an Umbraco project', () => {}, createUmbracoDockerfile)
  .command('umbraco:downloaddata', 'Download DB, css and media from Live server', () => { }, downloadUmbracoData)
  .command('umbraco:downloadmedia', 'Download media only from Live server', () => { }, () => downloadUmbracoData('media'))
  .command('umbraco:uploaddata', 'Upload DB, css and media to live server', () => {}, uploadUmbracoData)
  .command('umbraco:downloadsynccontent', 'Download uSync data from server', () => { }, downloadSyncContent)
  .command('umbraco:createdokkustorages', 'Create dokku storages for Umbraco', () => { }, createUmbracoStorage)
  .command('dokku:creategithubaction', 'Create dokku github actions file', () => {}, createDokkuGithubActionFile)

  // .command('serve [port]', 'start the server', (yargs) => {
  //   return yargs
  //     .positional('port', {
  //       describe: 'port to bind on',
  //       default: 5000
  //     })
  // }, (argv) => {
  //   const ssh = getSettings('ssh')
  //   console.log('SERVE!!!', argv, ssh);
  // })
  .demandCommand(1, 1, 'Please provide a command')
  .parse();

// Options API
// alias: string or array of strings, see alias()
// choices: value or array of values, limit valid option arguments to a predefined set, see choices()
// coerce: function, coerce or transform parsed command line values into another value, see coerce()
// conflicts: string or objectfrom certain keys not to be set, see conflicts;
// default: value, set a default value for the option, see default ()
// defaultDescription: string, use this description for the default value in help content, see default ()
// desc / describe / description: string, the option description for help content, see describe()
// implies: string or objectfrom certain keys to be set, see implies;
// normalize: boolean, apply path.normalize() to the option, see normalize()
// type: one of the following strings
// 'boolean': synonymous for boolean: true, see boolean()
// 'number': synonymous for number: true, see number()
// 'string': synonymous for string: true, see string()
