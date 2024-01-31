const webpack = require('webpack');
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (_env, { mode }) => ({
  mode,
  entry: {
    main: './src/index.tsx',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: { transpileOnly: true },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      },
    ],
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src'),
      'react-dom$': 'react-dom/profiling',
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    // fallback:{
    //   "path": false
    // },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  devtool: mode === 'production' ? 'source-map' : 'eval-source-map',
  devServer: {
    compress: false,
    static: [
      {
        directory: path.join(__dirname, './assets'),
        publicPath: '/assets'
      },
      {
        directory: path.join(__dirname, './public'),
      },
    ],
    hot: false,
    client: false,
    host: '0.0.0.0',
    port: 8061,
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api', '/arkivert-dokument', '/kombinert-dokument', '/nytt-dokument', '/vedleggsoversikt'],
        target: 'https://kabal.intern.dev.nav.no',
        secure: false,
        changeOrigin: true,
        withCredentials: true,
        on: {
          proxyReq: (proxyReq, req, res) => {
            res.on('close', () => proxyReq.destroy());
          },
        }
      },
      {
        target: 'http://localhost:12347',
        context: ['/collect'],
        changeOrigin: true,
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
    new webpack.EnvironmentPlugin({'VERSION': 'dev'}),
    new ForkTsCheckerWebpackPlugin(),
  ]
});
