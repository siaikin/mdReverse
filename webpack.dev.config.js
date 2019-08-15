const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// 自定义NODE_ENV变量将其设置为开发模式
process.env.NODE_ENV = 'development';
module.exports = {
    entry: './demo.js',
    mode: "development",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "demo.js"
    },
    devServer: {
        contentBase: './dist'
    },
    devtool: "eval-source-map",
    module:  {
        rules: [
            {
                test: /\.css$/,
                exclude: /(node_modules|bower_components)/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: "./template.html",
            filename: "index.html"
        }),
        new ExtractTextPlugin('styles.css')
    ]
};
