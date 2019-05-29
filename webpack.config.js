const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const extractSCSS = new ExtractTextPlugin('[name]');

const config = {
    entry: {
        'popup.js': './src/popup.js',
        'background.js': './src/background.js',
        'content.js': './src/content.js',
        'styles.css': './src/styles.scss',
        'words.css': './src/words.scss',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name]',
    },
    module: {
        rules: [{
            test: /\.scss$/,
            loader: extractSCSS.extract(['css-loader', 'sass-loader'])
        }]
    },
    plugins: [
        extractSCSS,
        new CopyWebpackPlugin([{ from: 'static' }]),
        new HtmlWebpackPlugin({
            inject: false,
            filename: 'popup.html',
            title: 'Custom template',
            template: './src/popup.html'
        })
    ]
}

module.exports = config;