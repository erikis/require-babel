/**
 * Copyright 2020 Erik Isaksson
 * Released under MIT license, https://github.com/erikis/require-babel/blob/master/LICENSE
 */

/*global define */

define(['module', 'require-babel'], function (module, babel) {
    'use strict';

    var pluginConfig = module.config ? module.config() : {};
    pluginConfig.extension = pluginConfig.extension || '.txt';
    pluginConfig.extensions = pluginConfig.extensions || {};
    pluginConfig.transform = function (text) {
        return text;
    };

    return {
        version: babel.version,

        write: function (pluginName, name, write) {
            return babel.write.call(babel, pluginName, name, write);
        },

        load: function (name, parentRequire, load, config) {
            return babel.load.call(babel, name, parentRequire, load, config, pluginConfig);
        }
    };
});
