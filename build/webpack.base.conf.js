var path = require('path')
var merge = require('webpack-merge')
var webpack = require('webpack')
var config = require('./')
var utils = require('./utils')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var StyleLintPlugin = require('stylelint-webpack-plugin')
var SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin') //@TODO: update to version 2 in order to introduce the newest styles function
var pkg = require('../package.json')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var banner = {
    banner: [
    pkg.title + ' v' + pkg.version,
    pkg.homepage,
    ' Copyright (c) ' + pkg.year + ' - ' + pkg.author,
     pkg.license + ' License'
    ].join('\n'),
    entryOnly: true
}

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

var isDev = process.env.NODE_ENV === 'development'

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: isDev
      ? config.dev.assetsPublicPath
      : config.build.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.njk$/,
        loader: 'nunjucks-loader',
        include: [resolve('src/js-templates')]
      },
      {
        test: /\.js/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.(js|jsx|mjs)$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')],
        options: {
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            presets: ['es2015', 'stage-0'],
            cacheDirectory: true
        },
      },
      {
        test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: 'url-loader',
        include: [resolve('img')],
        options: {
          limit: 10000,
          name: utils.assetsPath(resolve('img'))
        }
      }
    ]
  },
  plugins: [
    ...utils.pageFile(isDev),
    new webpack.BannerPlugin(banner),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    new StyleLintPlugin({
        configFile: '.stylelintrc.json'
    }),
    new SVGSpritemapPlugin({
        src: resolve('src/svg-icon/*.svg'),
        filename: 'sprite.svg',
        prefix: '',
        svg4everybody: true
    }),
    new CopyWebpackPlugin([
        {from: resolve('img'), to: 'img'}
    ])
  ]
}
