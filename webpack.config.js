NODE_ENV = process.env.NODE_ENV;

var distFolderPath = "dist",
    webpack = require('webpack'),
    packageJson = require("./package.json"),
    Path = require('path'),
    //plugins
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    //configuration
    languages = ["en"/*, "it"*/],
    production = NODE_ENV === "test" ? false : true,
    plugins = [
        //Exclude vendors from dist
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
        // create native css output file
        new ExtractTextPlugin("style.css", {
            allChunks: true
        }),
    ],
    entry = {},
    vendors = Object.keys(packageJson.dependencies),
    nodeModulesDir = Path.resolve(__dirname, './node_modules');

// plugins included only in production environment
if (production) {

    plugins = plugins.concat([
        // uglify
        /*new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),*/
    ]);
}

// add entry for vendor bundle
entry["app"] = [packageJson.main];
entry["vendors"] =  vendors; //add every vendor here

module.exports = languages.map(function (lang) {

    return {
        debug: !production, //switch loader to debug mode
        devtool: production ? false : 'eval', //source map generation
        entry: entry,
        output: {
            path: Path.join(__dirname, distFolderPath),
            filename: production ? packageJson.name + '.js' : packageJson.name + ".js", //add min
            chunkFilename: 'chunk-[id].js',
            libraryTarget : 'amd'
        },
        //externals: vendors,
        resolve: {
            root: Path.resolve(__dirname),
            alias: {
                handlebars: 'handlebars/dist/handlebars.min.js',
                __nls: Path.resolve(__dirname, './src/nls/' + lang + "/"),
                __config: Path.resolve(__dirname, './src/config/'),
                __html: Path.resolve(__dirname, './src/html/'),
            }
        },
        module: {
            //jshint
            preLoaders: [
                //jshint
                {
                    test: /\.js$/, // include .js files
                    exclude: [nodeModulesDir], // exclude any and all files in the node_modules folder
                    loader: "jshint-loader"
                }
            ],
            loaders: [
                {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
                {test: /\.hbs$/, loader: "handlebars-loader"},
                {test: /\.json$/, loader: "json-loader"},
                {test: /\.(jpg|png)$/, loader: 'url?limit=30000&name=img/[name].[hash].[ext]'}, //inline images with size less than 30kb
            ],
        },

        plugins: plugins.concat([
            // define global scoped variable, force JSON.stringify()
            new webpack.DefinePlugin({
                __DEVELOPMENT__: !production,
                VERSION: JSON.stringify(packageJson.version),
                LANG: JSON.stringify(lang)
            }),
        ]),

        // more options in the optional jshint object
        jshint: {
            // any jshint option http://www.jshint.com/docs/options/
            // i. e.
            camelcase: true,

            // jshint errors are displayed by default as warnings
            // set emitErrors to true to display them as errors
            emitErrors: false,

            // jshint to not interrupt the compilation
            // if you want any file with jshint errors to fail
            // set failOnHint to true
            failOnHint: false,

            // custom reporter function
            reporter: function (errors) {
            }
        }
    };
});
