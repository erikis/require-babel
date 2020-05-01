# require-babel

AMD loader plugins for Babel: [run and debug](https://erikis.github.io/require-babel/) JavaScript code directly from source even when using ES modules and JSX

## Plugins

### babel.js

Base plugin, preconfigured for [transforming](https://babeljs.io/docs/en/babel-standalone) ES [modules](https://babeljs.io/docs/en/babel-plugin-transform-modules-amd) to [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition) including [source maps](https://developer.mozilla.org/en-US/docs/Tools/Debugger/How_to/Use_a_source_map) and recursively transforming imported modules with URLs ending with .js, by prepending "babel!". E.g., **./module.js** becomes **babel!./module**.

The intention is that babel.js will not normally be used directly, but rather through esm.js and jsx.js or other plugins.

### esm.js

Plugin preconfigured for transforming ES modules and recursively transforming imported modules with URLs ending with .js and .jsx, by prepending "esm!" and "jsx!", respectively. E.g., **./module.js** becomes **esm!./module**.

### jsx.js

Plugin preconfigured for transforming ES modules using [JSX](https://en.wikipedia.org/wiki/React_(web_framework)#JSX) syntax and recursively transforming imported modules with URLs ending with .js and .jsx, by prepending "esm!" and "jsx!", respectively. E.g., **./module.jsx** becomes **jsx!./module**.

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
          "esm": "https://cdn.jsdelivr.net/npm/require-babel@0/esm",
          "jsx": "https://cdn.jsdelivr.net/npm/require-babel@0/jsx",
          "require-babel": "https://cdn.jsdelivr.net/npm/require-babel@0/babel",
          "babel-standalone": "https://cdn.jsdelivr.net/npm/@babel/standalone@7/babel",
          "react": "https://cdn.jsdelivr.net/npm/react@16/umd/react.development",
          "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@16/umd/react-dom.development"
        }
      });
      require.exec = function(text) {
        // Do no eval (the default) because it breaks breakpoints
        var node = require.createNode(require.config);
        node.text = text;
        document.head.appendChild(node);
      };
      BABEL_ENV_TARGETS = { "chrome": "81", "firefox": "75", "safari": "13" };
      APP_LAUNCH_DELAY = 100; // ms to wait before launch for more reliable breakpoints
      require(["esm!./app"]); // transforms and runs app.js
    </script>
  </body>
</html>
```

## Install

npm install require-babel

## Demo

Try it here: [require-babel demo](https://erikis.github.io/require-babel/) (use developer tools to view source code, set breakpoints, etc.)

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

After installing the production dependencies (`npm install --production`), the demo app can be built using RequireJS and minified: `npm run build && npm run minify`.

After installing the development dependences (`npm install`), the demo app can be tested using `npm test` and built using webpack and minified: `npm run webpack && npm run minify`.

## License

MIT
