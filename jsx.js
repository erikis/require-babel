/**
 * Copyright 2020 Erik Isaksson
 * Released under MIT license, https://github.com/erikis/require-babel/blob/master/LICENSE
 */

/*global define */

define(['module', 'require-babel'], function (module, babel) {
    'use strict';

    var pluginConfig = module.config ? module.config() : {};
    pluginConfig.extension = pluginConfig.extension || '.jsx';
    pluginConfig.extensions = pluginConfig.extensions || { '.js': 'esm!', '.jsx': 'jsx!' };
    var options = pluginConfig.options = pluginConfig.options || {};
    var presets = babel.defaultPresets.slice();
    presets.push([ 'react', pluginConfig.react || {} ]);
    options.presets = options.presets || presets;

    return {
        version: babel.version,

        write: function(pluginName, name, write) {
            return babel.write.call(babel, pluginName, name, write);
        },

        load: function (name, parentRequire, load, config) {
            return babel.load.call(babel, name, parentRequire, load, config, pluginConfig);
        }
    };
});
