const webpack = require('webpack');
const merge = require('webpack-merge');
const ip = require('ip');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  // ...
  configureServer(app) {
    console.log('ip', ip.address());
    app.listen(this.serverPort, ip.address());
  },

  extendWebpackConfig(webpackConfig, env) {

    webpackConfig.plugins.forEach(function (plugin, i) {
      if (plugin.filename === '[name].[contenthash].css') {
        webpackConfig.plugins[i] = new ExtractTextPlugin('badbrowser.css');
      }
    });

    webpackConfig.plugins.forEach(function (plugin, i) {
      if (plugin.constructor.name == 'CommonsChunkPlugin' || plugin.constructor.name == 'ManifestPlugin') webpackConfig.plugins.splice(1, i)
    });

    const commonConfig = merge(webpackConfig, {
      output: {
        filename: 'badbrowser.js',
        library: 'badbrowser',
        libraryTarget: 'umd'
      },
      module: {
        rules: [],
      },

      plugins: [
        new webpack.ProvidePlugin({
          badbrowser: 'badbrowser',
          'window.badbrowser': 'badbrowser'
        })
      ]
    });

    const productionConfig = merge({
      plugins: []
    });

    const developmentConfig = merge({});

    return (env === 'production')? merge(commonConfig, productionConfig) : merge(commonConfig, developmentConfig);
  }
};
