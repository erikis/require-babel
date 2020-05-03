/**
 * @license require-babel 1.0.0
 * Copyright 2020 Erik Isaksson
 * Released under MIT license, https://github.com/erikis/require-babel/blob/master/LICENSE
 *
 * Based on AMD loader plugin for CoffeeScript:
 * https://github.com/requirejs/require-cs
 * Copyright jQuery Foundation and other contributors, https://jquery.org/
 */

/*global define, window, XMLHttpRequest, importScripts, Packages, java,
  ActiveXObject, process, require, JSON, BABEL_ENV_TARGETS */

define(['module', 'babel-standalone'], function (module, Babel) {
    'use strict';

    var masterConfig = module.config ? module.config() : {};

    var fs, getXhr,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        fetchText = function () {
            throw new Error('Environment unsupported.');
        },
        buildMap = {};

    if (typeof process !== "undefined" &&
               process.versions &&
               !!process.versions.node) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');
        fetchText = function (path, callback) {
            callback(fs.readFileSync(path, 'utf8'));
        };
    } else if ((typeof window !== "undefined" && window.navigator && window.document) || typeof importScripts !== "undefined") {
        // Browser action
        getXhr = function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            if (!xhr) {
                throw new Error("getXhr(): XMLHttpRequest not available");
            }

            return xhr;
        };

        fetchText = function (url, callback) {
            var xhr = getXhr();
            xhr.open('GET', url, true);
            xhr.onreadystatechange = function (evt) {
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    callback(xhr.responseText);
                }
            };
            xhr.send(null);
        };
        // end browser.js adapters
    } else if (typeof Packages !== 'undefined') {
        //Why Java, why is this so awkward?
        fetchText = function (path, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(path),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                stringBuffer.append(line);

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    }

    // Register a Babel plugin for transforming import URLs such as
    // "./test.js" (suffix/extension ".js") to e.g. "babel!./test" (prefix "babel!")
    // Also transform relative URLs such as "./test" to e.g. "babel!./test" using the special suffix "."
    // and transform other URLs such as "test" to e.g. "babel!test" using the special suffix ""
    var suffixToPrefix = {};
    var importVisitors = {
        ImportDeclaration: function (nodePath, state) {
            var source = nodePath.node.source;
            var match = source.value.match(/.+(\.[^\.]+)$/);
            var suffix;
            if (match !== null && suffixToPrefix.hasOwnProperty(suffix = match[1])) {
                source.value = suffixToPrefix[suffix] + source.value.slice(0, -suffix.length);
            } else if (source.value.match(/^\.?\.?\/.+/) !== null && suffixToPrefix.hasOwnProperty('.')) {
                source.value = suffixToPrefix['.'] + source.value;
            } else if (suffixToPrefix.hasOwnProperty('')) {
                source.value = suffixToPrefix[''] + source.value;
            }
        }
    };
    Babel.registerPlugin('x-transform-import-urls', {
        visitor: {
            Program: {
                enter: function (programPath, state) {
                    programPath.traverse(importVisitors, state);
                },
                exit: function (programPath, state) {
                    programPath.traverse(importVisitors, state);
                }
            }
        }
    });

    var envOptions = { targets: typeof BABEL_ENV_TARGETS !== 'undefined' ? BABEL_ENV_TARGETS : 'defaults' };
    var envPreset = [ 'env', envOptions ];

    return {
        version: '1.0.0',

        defaultPresets: [ envPreset ],

        defaultPlugins: [ 'x-transform-import-urls', 'transform-modules-amd' ],

        defaultExtensions: { '.js': 'babel!' },

        defaultTransform: function (text, options) {
            return function () {
                var compiled = Babel.transform(text, options);
                return compiled.code;
            };
        },

        write: function (pluginName, name, write) {
            if (buildMap.hasOwnProperty(name)) {
                var text = buildMap[name];
                write.asModule(pluginName + '!' + name, text);
            }
        },

        load: function (name, parentRequire, load, config, pluginConfig) {
            // Get config from (non-standard) 5th argument if this was invoked from another plugin
            pluginConfig = pluginConfig || masterConfig;

            // Get the suffix (file extension) from config or assume ".js"
            var suffix = pluginConfig.extension || '.js';

            // Convert the name + suffix to a URL
            var path = parentRequire.toUrl(name + suffix);
            var babel = this;
            fetchText(path, function (text) {

                // Get options from config and set default options
                var options = pluginConfig.options || {};
                options.presets = options.presets || babel.defaultPresets;
                options.plugins = options.plugins || babel.defaultPlugins;
                envPreset[1] = pluginConfig.env || envOptions;
                if (pluginConfig.hasOwnProperty('presets')) {
                    options.presets = options.presets.concat(pluginConfig.presets);
                    delete pluginConfig.presets; // do not concat again
                }
                if (pluginConfig.hasOwnProperty('plugins')) {
                    options.plugins = options.plugins.concat(pluginConfig.plugins);
                    delete pluginConfig.plugins; // do not concat again
                }
                suffixToPrefix = pluginConfig.extensions || babel.defaultExtensions;
                var transform = pluginConfig.transform || babel.defaultTransform;

                // If not a build, produce an inline source map for use in browser dev tools
                if (!config.isBuild) {
                    options.sourceMaps = 'inline';
                    options.sourceFileName = path;
                }

                // Transform, hold on to transformed text if a build, and load
                var transformed = transform(text, options);
                if (typeof transformed === 'function') {
                    text = transformed();
                    if (config.isBuild) {
                        buildMap[name] = text;
                    }
                    load.fromText(name, text);
                } else {
                    if (config.isBuild) {
                        text = 'define(function() { return ' + JSON.stringify(transformed) + '; );\n';
                        buildMap[name] = text;
                    }
                    load(transformed);
                }
            });
        }
    };
});
