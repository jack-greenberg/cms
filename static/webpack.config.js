const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports =  {
    mode: 'development',
    entry: {
        bundle: [
            './css/index.scss',
            './js/index.js'
        ],
        backend: [
            './backend/css/index.scss',
            './backend/js/index.js',
            'babel-polyfill',
        ],
        login: [
            './backend/js/login.js',
            './backend/css/login.scss',
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
    },
    watch: true,
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css"
        })
    ],
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: [MiniCssExtractPlugin.loader,'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
};
