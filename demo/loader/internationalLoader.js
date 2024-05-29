/**@format */

const loader = require("@aitianyu.cn/tianyu-shell/webpack");

function messageBundleLoader(source) {
    loader.MsgBundleLoader.apply(this, [source]);
}

module.exports = messageBundleLoader;
