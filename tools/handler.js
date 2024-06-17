/**@format */

const path = require("path");

module.exports.handleResolve = function (baseDir) {
    const tsConfig = require(`${baseDir}/tsconfig.json`);
    const tsPaths = tsConfig.compilerOptions.paths;

    const alias = {};
    for (const pathAlias of Object.keys(tsPaths)) {
        const formattedAlias = pathAlias.substring(0, pathAlias.length - 2);
        const targetPath = tsPaths[pathAlias][0];
        const formattedTargetPath = targetPath.substring(0, targetPath.length - 2);
        alias[formattedAlias] = path.resolve(baseDir, "..", formattedTargetPath);
    }

    const resolve = {
        extensions: [".ts", ".js", ".css", ".view.json", ".i18n.js", ".tsx", "png", "svg"],
        alias: alias,
    };

    return resolve;
};
