const path = require('path');
const webpack = require('webpack');
const contentBase = path.resolve(__dirname, 'dist');

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

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
        },{
            test: /pixi\.js/, 
            loader: 'expose?PIXI'
        },{
            test: /phaser-split\.js$/, 
            loader: 'expose?Phaser'
        },{
            test: /p2\.js/, 
            loader: 'expose?p2'
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        alias: {
            phaser: phaser,
            pixi: pixi,
            p2: p2
        },
        extensions: ['', '.js', '.jsx']
    }
}
