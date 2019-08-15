const path = require('path');

// 自定义NODE_ENV变量将其设置为生产模式
process.env.NODE_ENV = 'production';
module.exports = {
    entry: './src/index.js',
    mode: "production",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "md-reverse.js"
    },
    module:  {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: "> 0.25%, not dead",
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }
                            ]
                        ],
                        plugins: [
                            require('@babel/plugin-proposal-class-properties'),
                        ]
                    }
                }
            }
        ]
    }
};
