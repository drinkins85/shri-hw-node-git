const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  plugins: [
    new UglifyJsPlugin({
      include: /\.js$/,
      exclude: /node_modules/,
    }),
  ],
};
