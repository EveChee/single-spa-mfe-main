const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// the path(s) that should be cleaned
let pathsToClean = ['dist'];

// the clean options to use
let cleanOptions = {
  root: path.resolve(__dirname),
  // exclude: ['shared.js'],
  verbose: true,
  dry: false,
};
module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx'] ,
    modules: ['src/sspa']
  } ,
  externals: ['single-spa'],
  devtool: 'source-map',// 打包出的js文件是否生成map文件（方便浏览器调试）
  // mode: 'production',
  mode: 'development',
  entry: {
    index: './src/sspa/index.ts'
  },
  output: {
    filename: '[name].js',// 生成的fiename需要与package.json中的main一致
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      { parser: { system: false } },
      {
        test: /\.ts?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // 指定特定的ts编译配置，为了区分脚本的ts配置
              configFile: path.resolve(__dirname, './tsconfig.json'),
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
};