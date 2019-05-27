const path = require('path');

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
