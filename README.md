# require-babel

[Run and debug](https://erikis.github.io/require-babel/) modern JavaScript code directly from source even when using ES modules and JSX

## Why

* Possibility to run code from source served by a simple web server, without a prior build. Reload to use new code.
* No changes in the code required: just use modern JavaScript code, ES modules, and JSX as usual.
* Builds for production use work as usual and are completely self-contained, i.e., no other script will be required.
* These scripts are themselves not included in builds as they are not needed for built code.
* JavaScript was made for the web browser and any browser should be able to run all code.

## Plugins

These scripts are implemented as [AMD loader plugins](https://requirejs.org/docs/api.html#plugins) for [Babel](https://babeljs.io/).

### babel.js

Base plugin, preconfigured for [transforming](https://babeljs.io/docs/en/babel-standalone) ES [modules](https://babeljs.io/docs/en/babel-plugin-transform-modules-amd) to [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition) including [source maps](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map) and recursively transforming imported modules with URLs ending with .js, by prepending "babel!". E.g., **./module.js** becomes **babel!./module**.

The intention is that babel.js will not normally be used directly, but rather through esm.js and jsx.js or other plugins.

### esm.js

Plugin preconfigured for transforming [ES](https://en.wikipedia.org/wiki/ECMAScript) modules and recursively transforming imported modules with URLs ending with .js and .jsx, by prepending "esm!" and "jsx!", respectively. E.g., **./module.js** becomes **esm!./module**.

### jsx.js

Plugin preconfigured for transforming ES modules using [JSX](https://en.wikipedia.org/wiki/React_(web_framework)#JSX) syntax and recursively transforming imported modules with URLs ending with .js and .jsx, by prepending "esm!" and "jsx!", respectively. E.g., **./module.jsx** becomes **jsx!./module**.

### tsm.js

Plugin preconfigured for transforming ES modules using [TypeScript](https://en.wikipedia.org/wiki/TypeScript) syntax and recursively transforming imported modules with URLs ending with .ts and .tsx, by prepending "tsm!" and "tsx!", respectively. E.g., **./module.ts** becomes **tsm!./module**.

### tsx.js

Plugin preconfigured for transforming ES modules using TS/JSX syntax and recursively transforming imported modules with URLs ending with .ts and .tsx, by prepending "tsm!" and "tsx!", respectively. E.g., **./module.tsx** becomes **tsx!./module**.

Note that Babel does not type-check. See [TypeScript's handbook](https://www.typescriptlang.org/docs/handbook/typescript-tooling-in-5-minutes.html) to get started.

## Extras

These scripts are implemented as AMD loader plugins but do not use Babel.

### json.js

Plugin preconfigured for importing JSON files. Other plugins need to be configured to map the extension **.json** to **json!**. The script can be copied and configured for other use cases, e.g., **jsonld.js** for **.jsonld** files.

### text.js

Plugin preconfigured for importing text files. Other plugins need to be configured to map the extension **.txt** to **text!**. The script can be copied and configured for other use cases, e.g., **csv.js** for **.csv** files.

Note that it is best to avoid loading modules or files having the same name, only differing in file extension. Otherwise, there might be mix-ups in the build.

## Use

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>App</title>
  </head>
  <body>
    <script src="https://cdn.jsdelivr.net/npm/requirejs@2/require.js"></script>
    <script>
      require.config({
        baseUrl: ".",
        paths: {
          "esm": "https://cdn.jsdelivr.net/npm/require-babel@1/esm",
          "jsx": "https://cdn.jsdelivr.net/npm/require-babel@1/jsx",
          "require-babel": "https://cdn.jsdelivr.net/npm/require-babel@1/babel",
          "babel-standalone": "https://cdn.jsdelivr.net/npm/@babel/standalone@7/babel",
          "react": "https://cdn.jsdelivr.net/npm/react@16/umd/react.development",
          "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@16/umd/react-dom.development"
        },
        config: {
          //"esm": { extension: ".js", extensions: { ".js": "esm!", ".jsx": "jsx!" } }
        }
      });
      require.exec = function(text) {
        // Do no eval (the default)
        var node = require.createNode({});
        node.text = text;
        document.head.appendChild(node);
      };
      //BABEL_ENV_TARGETS = "defaults"; // no need to set; is the default
      BABEL_ENV_TARGETS = { "chrome": "81", "firefox": "75", "safari": "13" };
      require(["esm!./app"]); // transforms and runs app.js
    </script>
  </body>
</html>
```

## Install

npm install require-babel

## Demo

**Try it here: [require-babel demo](https://erikis.github.io/require-babel/)** (Use Developer Tools to view source code, set breakpoints, etc.)

* src/\* — .js files for ES modules, .jsx files for ES modules that use JSX syntax
* src/test/\* — tests for code in the parent directory
* app.html — launches app using minified build if available
* app.js — ES module that launches app, invoked by app-main.js
* app-main.html — launches app using source code, includes app-main.js
* app-main.js — JavaScript for launching app
* app-test.html — tests app using source code, includes app-test.js
* app-test.js — JavaScript for testing app
* package.json — dependencies, command lines for scripts, browserslist
* build.js — [RequireJS](https://github.com/requirejs/requirejs) ([r.js](https://github.com/requirejs/r.js)) build specification, used by `npm run build`
* webpack.config.js — webpack build specification, used by `npm run webpack`
* babel.config.json — Babel config for transcompilation, used by `npm test`

The demo app can be used locally by running, e.g, `npx serve -l 8123` while in the demo directory.

After installing the production dependencies (`npm install --production`), the demo app can be built using RequireJS and minified: `npm run build && npm run minify`. The build is intended to not affect global state on the page.

After installing the development dependencies (`npm install`), the demo app can be tested using `npm test` and built using webpack and minified: `npm run webpack && npm run minify`.

Note that the demo intentionally only makes use of esm.js and jsx.js.

## License

MIT
