import fs from 'fs';

const settingsFile = '.lunarc.json';
const cwd = process.cwd();

const defaultSettings = {
  ssh: 'root@ip-or-host',
  dokkuApp: 'dokkuappname',
  dotnetProject: 'if-dotnet-then-appname',
  volume: 'volume-directory-name',
  dokkuRemote: 'dokku-git-remote-name',
  githubUrl: 'https://github.com/orgname/reponame',
};

// Get settings from .umbraco.json
let settings = null;

if (fs.existsSync(settingsFile)) {
  const settingsString = fs.readFileSync(`${cwd}/${settingsFile}`, 'utf8');
  settings = JSON.parse(settingsString);
}

// Fail if no settings
export const getSetting = (key) => {
  if (!settings) {
    console.error(`No ${settingsFile} found`);
    process.exit(1);
  }
  if (!settings[key]) {
    console.error(`Missing setting: ${key}`);
    process.exit(1);
  }
  return settings[key];
};

export const createSettings = () => {
  if (fs.existsSync(settingsFile)) {
    console.log(`${settingsFile} already exists`);
  } else {
    console.log(`Creating ${settingsFile}`);
    fs.writeFileSync(settingsFile, JSON.stringify(defaultSettings, null, 2));
  }
};

export const createPrettier = () => {
  const prettierFile = '.prettierrc.json';
  if (fs.existsSync(prettierFile)) {
    console.log(`${prettierFile} already exists`);
  } else {
    console.log(`Creating ${prettierFile}`);
    fs.writeFileSync(
      prettierFile,
      JSON.stringify(
        {
          trailingComma: 'es5',
          singleQuote: true,
          printWidth: 120,
          tabWidth: 2,
          endOfLine: 'auto',
          semi: true,
        },
        null,
        2
      )
    );
    fs.writeFileSync(
      '.prettierignore',
      `node_modules
.vercel
.next
dist
`
    );
  }
};
