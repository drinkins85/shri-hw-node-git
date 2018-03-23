const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

const prodConfig = require('./webpack.production');
const devConfig = require('./webpack.development');

const isProduction = process.env.NODE_ENV === 'production';


const PATHS = {
  source: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'public'),
};

const common = {
  entry: `${PATHS.source}/js/main.js`,
  output: {
    path: PATHS.build,
    filename: 'js/bundle.js',
    publicPath: './',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: isProduction,
                sourceMap: isProduction,
                publicPath: '/css/',
              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'sass-loader',
            },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'img/',
              name: '[name].[ext]',
              publicPath: '/img/',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'fonts/',
              name: '[name].[ext]',
              publicPath: '/',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/style.css',
      publicPath: PATHS.build,
    }),
  ],
};

module.exports = function conf(env) {
  if (isProduction) {
    return merge([
      common,
      prodConfig,
    ]);
  }

  return merge([
    common,
    devConfig,
  ]);
};
