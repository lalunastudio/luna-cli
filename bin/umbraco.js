import inquirer from 'inquirer';
import { call } from './helpers.js';
import { getSetting } from './settings.js';

// Upload database and files to live server
export const uploadUmbracoData = async () => {
  const test = await inquirer.prompt([
    {
      message: 'Are you sure you want to upload and overwrite live data?',
      name: 'confirm',
      type: 'confirm',
    },
  ]);

  
  if (test.confirm) {
    // Create folders on server
    try {
      call(`ssh ${getSetting('ssh')} mkdir -p /mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/Data`);
    } catch (err) {}
    try {
      call(`ssh ${getSetting('ssh')} mkdir -p /mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/media`);
    } catch (err) {}
    try {
      call(`ssh ${getSetting('ssh')} mkdir -p /mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/css`);
    } catch (err) {}

    try {
      call(`scp -r ./umbraco/Data/* ${getSetting('ssh')}:/mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/Data`);
    } catch (err) {
      console.log('!! Error: /umbraco/Data', err.message);
    }
    try {
      call(
        `scp -r ./wwwroot/media/* ${getSetting('ssh')}:/mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/media`
      );
    } catch (err) {
      console.log('!! Error: /wwwroot/media', err.message);
    }
    try {
      call(`scp -r ./wwwroot/css/* ${getSetting('ssh')}:/mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/css`);
    } catch (err) {
      console.log('!! Error: /wwwroot/css', err.message);
    }
  }
};

// Download database and files from live server
export const downloadUmbracoData = (filter = '') => {
  if (!filter || filter === 'data') {
    try {
      call(
        `scp -r "${getSetting('ssh')}:/mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/Data/*" ./umbraco/Data`
      );
    } catch (err) {
      console.log('!! Error: /umbraco/Data', err.message);
    }
  }
  if (!filter || filter === 'media') {
    try {
      call(
        `scp -r "${getSetting('ssh')}:/mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/media/*" ./wwwroot/media`
      );
    } catch (err) {
      console.log('!! Error: /wwwroot/media', err.message);
    }
  }
  if (!filter || filter === 'css') {
    try {
      call(`scp -r "${getSetting('ssh')}:/mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/css/*" ./wwwroot/css`);
    } catch (err) {
      console.log('!! Error: /wwwroot/css', err.message);
    }
  }
};

// Sync uSync data up to live
export const uploadSyncContent = () => {
  call(`scp -r ./uSync ${getSetting('ssh')}:~/`);
};

// Sync uSync data down from live
export const downloadSyncContent = () => {
  try {
    call(`scp -r "${getSetting('ssh')}:/mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/uSync" ./`);
  } catch (err) {
    console.log('!! Error: /uSync', err.message);
  }
};

// Sync uSync data down from live
export const createUmbracoStorage = () => {
  // Create folders on server
  try {
    call(`ssh ${getSetting('ssh')} mkdir -p /mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/Data`);
  } catch (err) {}
  try {
    call(`ssh ${getSetting('ssh')} mkdir -p /mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/media`);
  } catch (err) {}
  try {
    call(`ssh ${getSetting('ssh')} mkdir -p /mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/css`);
  } catch (err) {}
  try {
    call(`ssh ${getSetting('ssh')} mkdir -p /mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/uSync`);
  } catch (err) {}

  const res = call(`ssh ${getSetting('ssh')} dokku storage:list ${getSetting('dokkuApp')}`);
  const storages = res
    .split('\n')
    .filter((line) => line.includes(getSetting('volume')))
    .map((line) => ({ vol: line.split(':')[0].trim(), dest: line.split(':')[1].trim() }));

  // console.log('storages', storages);
  let shouldRebuild = false;
  // dokku storage:mount royalarena /mnt/${getSetting('volume')}/royalarena:/app/umbraco/Data

  if (
    !storages.find(
      (st) =>
        st.vol === `/mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/Data` && st.dest === '/app/umbraco/Data'
    )
  ) {
    console.log('## Creating data storage');
    call(
      `ssh ${getSetting('ssh')} dokku storage:mount ${getSetting('dokkuApp')} /mnt/${getSetting('volume')}/${getSetting(
        'dokkuApp'
      )}/Data:/app/umbraco/Data`
    );
    shouldRebuild = true;
  }

  if (
    !storages.find(
      (st) =>
        st.vol === `/mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/media` && st.dest === '/app/wwwroot/media'
    )
  ) {
    console.log('## Creating media storage');
    call(
      `ssh ${getSetting('ssh')} dokku storage:mount ${getSetting('dokkuApp')} /mnt/${getSetting('volume')}/${getSetting(
        'dokkuApp'
      )}/media:/app/wwwroot/media`
    );
    shouldRebuild = true;
  }

  if (
    !storages.find(
      (st) => st.vol === `/mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/css` && st.dest === '/app/wwwroot/css'
    )
  ) {
    console.log('## Creating css storage');
    call(
      `ssh ${getSetting('ssh')} dokku storage:mount ${getSetting('dokkuApp')} /mnt/${getSetting('volume')}/${getSetting(
        'dokkuApp'
      )}/css:/app/wwwroot/css`
    );
    shouldRebuild = true;
  }

  if (
    !storages.find(
      (st) => st.vol === `/mnt/${getSetting('volume')}/${getSetting('dokkuApp')}/uSync` && st.dest === '/app/uSync'
    )
  ) {
    console.log('## Creating css storage');
    call(
      `ssh ${getSetting('ssh')} dokku storage:mount ${getSetting('dokkuApp')} /mnt/${getSetting('volume')}/${getSetting(
        'dokkuApp'
      )}/uSync:/app/uSync`
    );
    shouldRebuild = true;
  }

  if (shouldRebuild) {
    console.log('## Rebuilding app');
    call(`ssh ${getSetting('ssh')} dokku ps:rebuild ${getSetting('dokkuApp')}`);
  }
};

// Create umbraco Dockerfile
export const createUmbracoDockerfile = () => {
  const dockerfile = 'Dockerfile';
  if (fs.existsSync(dockerfile)) {
    console.log(`${dockerfile} already exists`);
  } else {
    console.log(`Creating ${dockerfile}`);
    fs.writeFileSync(
      dockerfile,
      `
########################
### build
########################
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build

# ARG PROJECT

WORKDIR /src

ENV PROJECT=${getSetting('dotnetProject')}

RUN echo "Starting Project build: \${PROJECT}"

COPY . .

RUN dotnet restore "\${PROJECT}.csproj"

RUN dotnet publish "\${PROJECT}.csproj" --configuration Release --no-restore --output /app

########################
### final
########################
FROM mcr.microsoft.com/dotnet/aspnet:6.0 

ENV PROJECT=${getSetting('dotnetProject')}

WORKDIR /app

ENV ASPNETCORE_URLS "http://*:5000"

ENV DLL="\${PROJECT}.dll"

COPY --from=build /app .

RUN echo "#!/bin/sh\ndotnet \${DLL}" > ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["./entrypoint.sh"]

`
    );
  }
};
