/* eslint-disable @typescript-eslint/no-var-requires */
const { generateApi } = require('swagger-typescript-api');
const path = require('path');
const fs = require('fs');

/* NOTE: all fields are optional expect one of `output`, `url`, `spec` */
generateApi({
  name: 'filename.d.ts',
  output: path.resolve(process.cwd(), './@types/'),
  url: 'https://swaggerdocs-url/swagger.json',
  // templates: path.resolve(process.cwd(), './api-templates'),
  // httpClientType: 'axios', // or "fetch"
  // defaultResponseAsSuccess: false,
  // generateRouteTypes: false,
  // generateResponses: true,
  // toJS: false,
  generateClient: false,
  // extractRequestParams: false,
  // extractRequestBody: false,
  // prettier: {
  //   // By default prettier config is load from your project
  //   printWidth: 120,
  //   tabWidth: 2,
  //   trailingComma: 'all',
  //   parser: 'typescript',
  // },
  // defaultResponseType: 'void',
  // singleHttpClient: true,
  cleanOutput: false,
  // enumNamesAsValues: false,
  // moduleNameFirstTag: false,
  // generateUnionEnums: false,
  // extraTemplates: [],
  // hooks: {
  //   onCreateComponent: (component) => {},
  //   onCreateRequestParams: (rawType) => {},
  //   onCreateRoute: (routeData) => {},
  //   onCreateRouteName: (routeNameInfo, rawRouteInfo) => {},
  //   onFormatRouteName: (routeInfo, templateRouteName) => {},
  //   onFormatTypeName: (typeName, rawTypeName) => {},
  //   onInit: (configuration) => {},
  //   onParseSchema: (originalSchema, parsedSchema) => {},
  //   onPrepareConfig: (currentConfiguration) => {},
  // },
})
  .then(({ files }) => {
    files.forEach(({ content, name }) => {
      const fixedContent = `/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

${content.replace(/export\s/g, '')}`;
      fs.writeFileSync(path.resolve(process.cwd(), './@types/', name), fixedContent, 'utf8');
    });
  })
  .catch((e) => console.error(e));
