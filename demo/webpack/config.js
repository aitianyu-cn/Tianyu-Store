/**@format */

const path = require("path");

module.exports.extensions = [".ts", ".js", ".css", ".view.json", ".i18n.js", ".tsx", "png", "svg"];

module.exports.static = [
    {
        directory: path.resolve(__dirname, "../website", "public"),
        publicPath: "/public",
    },
    {
        directory: path.resolve(__dirname, "../website", "static"),
        publicPath: "/static",
    },
];

module.exports.resolve = {
    fallback: {},
};
