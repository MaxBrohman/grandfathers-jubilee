const path = require('path');

module.exports = {
    entry: {
            index: './src/index.ts'
        },
    output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'dist')
        },
    mode: 'production',
    devtool: 'source-map',
    devServer: {
        contentBase: './dist'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    }
}