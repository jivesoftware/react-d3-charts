var webpack = require('webpack');
module.exports = {
  entry: [
    'webpack/hot/only-dev-server',
    './demo/js/app.js'
  ],
  output: {
    path: './demo',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
    { test: /\.js?$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
    { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
    { test: /\.css$/, loader: 'style!css' },
    { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json' ]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};
