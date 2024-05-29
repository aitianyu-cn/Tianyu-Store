/**@format */

const path = require("path");

const { handleResolve } = require("./handler");

const { static } = require("./config");
const { rules } = require("./modules");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const baseDir = path.resolve(__dirname, "..");

module.exports = {
    entry: {
        index: path.resolve(baseDir, "website/index.tsx"),
    },
    output: {
        path: path.join(baseDir, "/build"),
        filename: "tianyu-store/demo/[name].[contenthash:8].js",
        chunkFilename: "tianyu-store/demo/[name].chunks.[contenthash:6].js",
        environment: {
            arrowFunction: false,
        },
    },
    module: {
        rules: rules,
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "tianyu-store-demo",
            template: path.resolve(baseDir, "website/index.html"),
            filename: "index.html",
            chunks: ["index"],
            favicon: path.resolve(baseDir, "website/index_favicon.ico"),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(baseDir, "./website/static"),
                    to: path.resolve(baseDir, "./build/static"),
                },
                {
                    from: path.resolve(baseDir, "./website/public"),
                    to: path.resolve(baseDir, "./build/public"),
                },
            ],
        }),
    ],
    resolve: handleResolve(baseDir),
    mode: "development",
    devtool: "source-map",
    devServer: {
        port: 3000,
        host: "0.0.0.0",
        allowedHosts: "all",
        static: static,
        proxy: [
            {
                context: ["/remote-resources"],
                target: "http://resource.aitianyu.cn",
                pathRewrite: { "^/remote-resources": "/resources" },
            },
        ],
    },
    performance: {
        hints: "warning",
        maxEntrypointSize: 50000000,
        maxAssetSize: 30000000,
        assetFilter: function (assetFilename) {
            return assetFilename.endsWith(".js");
        },
    },
};
