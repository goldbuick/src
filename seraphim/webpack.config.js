const path = require('path');
const webpack = require('webpack');

const srcPath = path.resolve(__dirname, './src');
const distPath = path.resolve(__dirname, './dist');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor.bundle.js'
    }),
    new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),
    new webpack.NamedModulesPlugin(),
];

if (isProd) {
    plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
            },
            output: {
                comments: false
            },
        })
    );
} else {
    plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
}

module.exports = {
    plugins,
    entry: {
        app: './src/app.js',
        vendor: [ 'react' ]
    },
    output: {
        path: distPath,
        filename: 'app.bundle.js',
    },
    resolve: {
        extensions: ['.js'],
        modules: [ 
            path.resolve(__dirname, 'node_modules'),
            srcPath
        ],
    },
    module: {
        rules: [{
            test: /\.css$/,
            exclude: /node_modules/,
            use: [
                'style-loader',
                'css-loader'
            ]
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
                'babel-loader'
            ],
        }]
    },
    devtool: isProd ? 'source-map' : 'eval',
    devServer: {
        port: 7154,
        hot: !isProd,
        host: '0.0.0.0',
        inline: !isProd,
        compress: isProd,
        contentBase: distPath,
        historyApiFallback: true,
        stats: {
            assets: true,
            children: false,
            chunks: false,
            hash: false,
            modules: false,
            publicPath: false,
            timings: true,
            version: false,
            warnings: true,
            colors: {
                green: '\u001b[32m',
            }
        },
    },
};