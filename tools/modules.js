/**@format */

const path = require("path");
const MineCssExtractPlugin = require("mini-css-extract-plugin");

module.exports.rules = [
    {
        test: /\.ts$/,
        use: [
            {
                loader: "babel-loader",
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                corejs: "3",
                                useBuiltIns: "usage",
                            },
                        ],
                    ],
                },
            },
            "ts-loader",
        ],
        exclude: /node_modules/,
    },
    {
        test: /\.tsx$/,
        use: [
            {
                loader: "babel-loader",
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                corejs: "3",
                                useBuiltIns: "usage",
                            },
                        ],
                    ],
                },
            },
            {
                loader: "ts-loader",
                options: {
                    transpileOnly: true,
                },
            },
        ],
        exclude: /node_modules/,
    },
    {
        test: /\.properties$/,
        use: [
            {
                loader: "babel-loader",
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                corejs: "3",
                                useBuiltIns: "usage",
                            },
                        ],
                    ],
                },
            },
            path.resolve(__dirname, "..", "loader/internationalLoader.js"),
        ],
        // exclude: /node_modules/,
    },
    {
        test: /\.css$/i,
        exclude: /(node_modules|bower_components)/,
        use: [MineCssExtractPlugin.loader, "css-loader"],
    },
];
