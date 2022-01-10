const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry: "./src/index.tsx",

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [ "style-loader", "css-loader" ]
            }
        ]
    },

    resolve: {
        extensions: [ ".tsx", ".ts", ".js" ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            title: "Bitburner Stats Viewer"
        })
    ],

    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "../../dist/ws-stats-viewer"),
        clean: true
    }
}
