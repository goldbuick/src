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
        './src/app.jsx'
    ],
    output: {
        path: contentBase,
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [{
            loader: 'babel-loader',
            test: /\.jsx?$/,
            include: [
                path.resolve(__dirname, 'src'),
            ],
            query: {
                'presets': [ 'react', 'es2015' ],
                'plugins': [ 'transform-runtime', 'transform-class-properties' ]    
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
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: { warnings: false },
        //     output: { comments: false }
        // })
    ]
}
