var distFolderPath = "dist",
    demoFolderPath = "demo",
    devFolderPath = "demo",
    webpack = require('webpack'),
    packageJson = require("./package.json"),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    Path = require('path'),
    dependencies = Object.keys(packageJson.dependencies);

module.exports = {

    debug: isProduction(false, true),

    devtool: isProduction('source-map', 'eval'),

    entry: getEntry(),

    output: getOutput(),

    resolve: {
        root: Path.resolve(__dirname),
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js'
        }
    },

    externals: isDemo(undefined, dependencies),

    module: {
        loaders: [{test: /\.hbs$/, loader: "handlebars-loader"}]
    },

    plugins: clearArray([
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        isDemo(undefined, new CleanWebpackPlugin([distFolderPath])),
        isProduction(new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false},
            output: {comments: false}
        })),
        isDemo(new HtmlWebpackPlugin({
            filename: "../index.html",
            template: "./demo/index.template.html"
        }))
    ])

};

function getEntry() {

    var entry = {};

    switch (getEnvironment()) {

        case "demo" :
            entry["app"] = ["demo/src/js/demo.js"];
            break;
        case "develop" :
            entry["app"] = ["dev/src/js/dev.js"];
            break;
        default :
            entry["app"] = ["src/js/index.js"];
    }

    return entry;
}

function getOutput() {

    var output;

    switch (getEnvironment()) {

        case "demo" :
            output = {
                path: Path.join(__dirname, demoFolderPath, distFolderPath),
                filename: "index.js"
            };
            break;
        case "production" :
            output = {
                path: Path.join(__dirname, distFolderPath),
                filename: packageJson.name + '.min.js',
                chunkFilename: 'chunk-[id].' + packageJson.name + '.min.js',
                libraryTarget: 'amd'
            };
            break;
        case "develop" :
            output = {
                path: Path.join(__dirname, distFolderPath, devFolderPath),
                filename: "index.js"
            };
            break;
        default :
            output = {
                path: Path.join(__dirname, distFolderPath),
                filename: packageJson.name + ".js",
                chunkFilename: 'chunk-[id].' + packageJson.name + '.js',
                libraryTarget: 'amd'
            };
    }

    return output;
}

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

function isDemo(valid, invalid) {

    return isEnvironment('demo') ? valid : invalid;
}

function isEnvironment(env) {
    return getEnvironment() === env;
}

function getEnvironment() {
    return process.env.NODE_ENV;
}