module.exports = {
    entry: './src/index.ts',
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
        extensions: [".tsx", ".ts", ".js"]
    }
}