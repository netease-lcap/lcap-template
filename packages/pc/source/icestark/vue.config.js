const path = require('path');

module.exports = {
    configureWebpack(config) {
        if (process.env.NODE_ENV === 'production') {
            config.devtool = false;
        }

        config.output.libraryTarget = 'umd';
        config.output.library = __microAppName__;

        /// cloud-ui-alias-start
        config.resolve.alias['@lcap/pc-ui$'] = path.resolve(__dirname, 'node_modules/@lcap/pc-ui/dist-theme/index.js');
        config.resolve.alias['@lcap/pc-ui/css$'] = path.resolve(__dirname, 'node_modules/@lcap/pc-ui/dist-theme/index.css');
        config.resolve.alias['cloud-ui.vusion'] = '@lcap/pc-ui';
        /// cloud-ui-alias-end
    },
    chainWebpack(config) {
        config.optimization.minimizer('terser')
            .tap((args) => {
                args[0].terserOptions.compress.drop_console = ['info', 'log', 'warn'];
                return args;
            });
    },
    lintOnSave: false,
    runtimeCompiler: true,
    css: {
        extract: true,
    },
    chainWebpack: (config) => {
        config.module.rule('fonts').use('url-loader').loader('url-loader').options({}).end();
        config.module.rule('images').use('url-loader').loader('url-loader').options({}).end();
    },
    devServer: {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        port: 8810,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                autoRewrite: true,
            },
            '/rest': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                autoRewrite: true,
            },
            '^/gateway/': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                autoRewrite: true,
            },
            '^/gw/': {
                target: `http://localhost:8080`,
                changeOrigin: true,
                autoRewrite: true,
            },
            '^/upload': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                autoRewrite: true,
            },
        },
    },
};
