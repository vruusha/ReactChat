const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
    clean: true,
    publicPath: '/',
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"]
  },
  devServer: {
    proxy: {
      '**': {
        target: 'http://localhost:8080'
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    disableHostCheck: true,
    port: 3000,
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    hotOnly: true
  },
  devtool: 'source-map',
  target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.css|.scss$/i,
        use: ['style-loader', 'css-loader','sass-loader'],
      },
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: "babel-loader",
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
      template: "./src/index.html",
      filename: "./index.html"
    }),
  ],
};