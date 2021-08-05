/* eslint-disable import/newline-after-import */
/* eslint-disable comma-dangle */
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

const URL5000 = require('child_process')
   .execSync('gp url 5000')
   .toString()
   .trim();
const socketUrl = new URL(URL5000);
socketUrl.protocol = 'ws';

module.exports = {
   entry: ['./src/index.ts'],
   resolve: {
      extensions: ['.ts', '.js', '.scss'],
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
      host: '0.0.0.0',
      public: require('child_process')
         .execSync('gp url 3000')
         .toString()
         .trim(),
      compress: true,
      allowedHosts: ['localhost', '.gitpod.io'],
      hot: true,
      proxy: {
         '/socket.io': {
            target: socketUrl.href,
            changeOrigin: true,
         },
      },
   },
   module: {
      rules: [
         {
            test: /\.ts$/i,
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
                     importLoaders: 2,
                  },
               },
               'sass-loader',
            ],
         },
         {
            test: /\.s?css$/i,
            exclude: /\.module\.s?css$/i,
            use: ['style-loader', 'css-loader', 'sass-loader'],
         },
         {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
         },
         // {
         //    test: /\.js$/i,
         //    use: ['webpack-remove-debug'],
         // },
      ],
   },
   devtool: 'source-map',
   plugins: [
      new HTMLWebpackPlugin({
         template: path.resolve(__dirname, 'public/index.html'),
         filename: 'index.html',
      }),
   ],
};
