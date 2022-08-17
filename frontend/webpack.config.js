const webpack = require('webpack');
const path = require('path');

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
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                strictMath: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource'
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  devtool: mode === 'production' ? 'source-map' : 'eval-source-map',
  devServer: {
    static: [
      {
        directory: path.join(__dirname, './assets'),
        publicPath: '/assets'
      },
      {
        directory: path.join(__dirname, './public'),
      },
    ],
    hot: true,
    host: '0.0.0.0',
    port: 8061,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'https://kabal.dev.nav.no',
        secure: false,
        changeOrigin: true,
        withCredentials: true,
      },
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
    new webpack.EnvironmentPlugin({'VERSION': 'dev'}),
  ]
});
