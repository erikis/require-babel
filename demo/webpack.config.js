module.exports = {
  entry: './app.js',
  mode: 'production',
  output: {
    filename: 'app.build.js',
    path: __dirname
  },
  optimization: { minimize: false },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [ [ '@babel/preset-env', { targets: "defaults" } ] ],
          //presets: [ [ '@babel/preset-env', { targets: { "chrome": "81" } } ] ],
          //plugins: [ [ '@babel/plugin-transform-runtime', { corejs: 3 } ] ]
        }
      }
    }, {
      test: /\.jsx$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [ [ '@babel/preset-env', { targets: "defaults" } ], '@babel/preset-react' ],
          //presets: [ [ '@babel/preset-env', { targets: { "chrome": "81" } } ], '@babel/preset-react' ],
          //plugins: [ '@babel/transform-react-jsx', [ '@babel/plugin-transform-runtime', { corejs: 3 } ] ]
        }
      }
    }]
  }
};
