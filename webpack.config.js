var distFolderPath = "dist",
    webpack = require('webpack'),
    packageJson = require("./package.json"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    Path = require('path'),
    entry = {},
    dependencies = Object.keys(packageJson.dependencies);

entry["app"] = ["src/js/index.js"];

module.exports = {

    debug: isProduction(false, true),

    devtool: isProduction('source-map', 'eval'),

    entry: entry,

    output: {
        path: Path.join(__dirname, distFolderPath),
        filename: isProduction(packageJson.name + '.min.js', packageJson.name + ".js"),
        chunkFilename: 'chunk-[id].' + packageJson.name + '.min.js',
        libraryTarget: 'amd'
    },

    resolve: {
        root: Path.resolve(__dirname),
        alias: {
            //handlebars: 'handlebars/dist/handlebars.min.js',
            //jquery: "jquery/src/jquery"
        }
    },

    externals: dependencies,

    module: {
        loaders: [{test: /\.hbs$/, loader: "handlebars-loader"}]
    },

    plugins: clearArray(([
        new CleanWebpackPlugin([distFolderPath]),
        isProduction(new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false},
            output: {comments: false}
        }))
    ]))

};

// utils

function clearArray(array) {

    var result = [];

    array.forEach(function (s) {
        s ? result.push(s) : null;
    });

    return result;

}

function isProduction(valid, invalid) {

    return isEnvironment('production') ? valid : invalid;
}

function isDevelop(valid, invalid) {

    return isEnvironment('develop') ? valid : invalid;
}

function isTest(valid, invalid) {

    return isEnvironment('develop') ? valid : invalid;
}

function isEnvironment(env) {
    return process.env.NODE_ENV === env;
}