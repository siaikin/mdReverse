const path = require('path');

// 自定义NODE_ENV变量将其设置为开发模式
process.env.NODE_ENV = 'development';

const multiConfig = [
    {
        name: 'demo',
        entry: './src/index.js',
        mode: "development",
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: "md-reverse.demo.js",
            library: 'MdReverse',
            libraryTarget: 'umd',
            libraryExport: 'default',
        },
        devServer: {
            contentBase: './demo',
            publicPath: '/dist/',
        },
        devtool: "eval-source-map"
    },
    {
        name: 'browser',
        entry: './src/index.js',
        mode: "development",
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: "md-reverse.browser.js",
            library: 'MdReverse',
            libraryTarget: 'umd',
            libraryExport: 'default',
        },
    },
    {
        name: 'browser-min',
        entry: './src/index.js',
        mode: "production",
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: "md-reverse.browser.min.js",
            library: 'MdReverse',
            libraryTarget: 'umd',
            libraryExport: 'default',
        },
    }
];

module.exports = (envArgs) => {
    let configs;
    if (!envArgs) {
        configs = multiConfig;
    } else {
        const enabledConfigNames = Object.keys(envArgs);
        const enabledConfigs = multiConfig.filter((config) => enabledConfigNames.includes(config.name));
        if (!enabledConfigs.length) {
            throw new Error(`找不到名为 ${JSON.stringify(enabledConfigNames)} 的配置. 可用的所有配置: ${multiConfig.map(config => config.name).join(', ')}`);
        }

        configs = enabledConfigs;
    }

    console.log(`正在构建的配置: ${configs.map(config => config.name).join(', ')}.\n`);
    return configs;
};
