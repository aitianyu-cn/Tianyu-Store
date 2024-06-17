/** @format */

const path = require("path");

const { handleResolve } = require("../handler");
const { rules } = require("../modules");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const baseDir = __dirname;

module.exports = {
    entry: {
        index: path.resolve(baseDir, "scripts/index.ts"),
        dev: path.resolve(baseDir, "scripts/Devtools.ts"),
        Background: path.resolve(baseDir, "scripts/Background.ts"),
    },
    output: {
        path: path.join(baseDir, "/build"),
        filename: "scripts/[name].js",
        chunkFilename: "scripts/[name].chunks.[contenthash:6].js",
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
            title: "tianyu-store devtools",
            template: path.resolve(baseDir, "./index.html"),
            filename: "index.html",
            chunks: ["index"],
        }),
        new HtmlWebpackPlugin({
            title: "tianyu-store devtools",
            template: path.resolve(baseDir, "./devtools.html"),
            filename: "devtools.html",
            chunks: ["dev"],
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "css/[name].chunks.css",
        }),
    ],
    resolve: handleResolve(baseDir),
    mode: "production",
    devtool: false,
    devServer: {
        port: 3000,
        host: "0.0.0.0",
        allowedHosts: "all",
        static: [],
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
