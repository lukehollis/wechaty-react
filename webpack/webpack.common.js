const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const BundleTracker = require("webpack-bundle-tracker");
const _template = require('lodash.template');
const fs = require('fs');
const path = require('path')


module.exports = {
    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, '../dist'),
        clean: true,
        publicPath: '/',
    },
    devtool: 'source-map',
    plugins:
    [
        new CopyWebpackPlugin({
            patterns: [
                { 
                    from: path.resolve(__dirname, '../static'),
                    globOptions: {
                        ignore: ['**/index.html']
                    }
                }
            ]
        }),
        new MiniCSSExtractPlugin({
          filename: 'styles/[name].[contenthash].css',
          chunkFilename: 'styles/[id].[contenthash].css',
        }),
        new BundleTracker({ path: __dirname, filename: "webpack-stats.json" }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../static/index.html'),
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            },
            inject: true
        }),
    ],
    module:
    {
        rules:
        [
            // HTML
            {
                test: /\.(html)$/,
                use: ['html-loader']
            },

            // JS
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:
                [
                    'babel-loader'
                ]
            },

            // CSS
            {
                test: /\.css$/,
                use:
                [
                    MiniCSSExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader' 
                ]
            },

            // Images
            {
                test: /\.(jpg|png|gif|svg)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/images/'
                        }
                    }
                ]
            },
            
            // Shaders
            {
                test: /\.glsl$/,
                use: 'raw-loader',
            },

            // Fonts
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use:
                [
                    {
                        loader: 'file-loader',
                        options:
                        {
                            outputPath: 'assets/fonts/'
                        }
                    }
                ]
            }
        ]
    }
}
