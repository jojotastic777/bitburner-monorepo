const path = require("path")

module.exports = {
    ...require("./webpack.config.js"),
    mode: "development",

    devtool: "inline-source-map",
    devServer: {
        static: path.resolve(__dirname, "../../dist/ws-stats-viewer")
    }
}