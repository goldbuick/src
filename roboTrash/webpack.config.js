const path = require('path');
const webpack = require('webpack');
const contentBase = path.resolve(__dirname, 'dist');

module.exports = {
    devServer: {
        hot: true,
        inline: true,
        contentBase: contentBase
    },
    entry: [
        'babel-polyfill',
        './src/Entry.jsx'
    ],
    output: {
        path: contentBase,
        filename: 'Entry.bundle.js'
    },
    module: {
        loaders: [{
            loader: 'babel-loader',
            test: /\.jsx?$/,
            include: [
                path.resolve(__dirname, 'src'),
            ],
            query: {
                cacheDirectory: true,
                presets: [ 'react', 'es2015', 'stage-0' ],
                plugins: [ 'transform-runtime' ]    
            }
        },{
            test: /\.less$/,
            loader: "style!css!less"
        },{
            test: /\.css$/, 
            loader: 'style!css' 
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        alias: {
        },
        extensions: ['', '.js', '.jsx']
    }
}
