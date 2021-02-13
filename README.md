# preact-es2020-template
A skeleton for un-bundled preact projects.

## Install
_this command will do an `npm install` for you_
```bash
npm run vendor
```

## Build
```bash
npm run build
```

## Watch
```bash
npm run watch
```

## Serve
```bash
npm run serve
```

No bundler, pure ES2020 modules loaded directly into the browser.  It uses es-module-shims for import map support (not yet implemented in any browsers) but otherwise doesn't use any special loaders, bundlers, file servers, etc.  Hosting is done via a static file server, you could use any static file server you wanted but I chose http-server because it is small and simple.

The one caveat with this project is the vendoring of dependencies.  To add a runtime dependency:
1. open `build/vendor.ts`
1. create an entry in the array
1. specify the dependency package name
1. specify the path within the package that should be copied (whole folder will be vendored, usually this is a dist or out folder)
1. the path (relative to the copied folder from previous step) to the index file
1. from the root directory of this project run `npm run vendor`

This will generate the runtime import map and embed it into your `index.html` file so the browser can turn `import { ... } from 'my-package'` into `import { ... } from './vendor/my-package/index.js'`.
