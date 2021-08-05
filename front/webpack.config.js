const path = require('path');
const EslintWebpackPlugin = require('eslint-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./src/index.ts'],
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, '../public'),
    clean: true,
  },
  stats: 'errors-warnings',
  devServer: {
    // inline: true,
    port: 3000,
    publicPath: '/',
    contentBase: path.resolve(__dirname, 'public'),
    // compress: true,
    hot: true,
    proxy: {
       '/socket.io': {
        target: 'ws://localhost:5000',
        changeOrigin: true
       },
    }
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/i,
        use: ['ts-loader'],
      },
      {
        test: /\.module\.s?css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              // importLoaders: 1,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.s?css$/i,
        exclude: /\.module\.s?css$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.js$/i,
        use: ['webpack-remove-debug']
      }
    ],
  },
  devtool: 'source-map',
  plugins: [
    new EslintWebpackPlugin({ fix: true }),
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      filename: 'index.html'
    })
  ]
};
