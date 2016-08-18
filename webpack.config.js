NODE_ENV = process.env.NODE_ENV;

var distFolderPath = "dist",
    webpack = require('webpack'),
    packageJson = require("./package.json"),
    Path = require('path'),
    //plugins
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    //configuration
    languages = ["en"/*, "it"*/],
    production = NODE_ENV === "test" ? false : true,
    plugins = [
        //clean dist folder before build
        new CleanWebpackPlugin(['dist'], {
            //root: '/full/project/path',
            //verbose: true,
            //dry: false
        }),
        // create native css output file
        new ExtractTextPlugin("style.[hash].css", {
            allChunks: true
        }),
        // compile index.html from template and inject hashed js
        new HtmlWebpackPlugin({
            filename: "index.html",
            inject: "body",
            template: "./index.template.html"
        }),
    ],
    entry = {};

// plugins included only in production environment
if (production) {

    plugins = plugins.concat([
        // vendor in a separate bundle, hash for long term cache
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            filename: "vendor.[hash].js",
            chucks: ["vendor"]
        }),
        //Merge small chunks that are lower than this min size (in chars)
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 51200, // ~50kb
        }),
        /*new webpack.optimize.AggressiveMergingPlugin({
         minSizeReduce: 1.5,
         //moveToParents: true,
         //entryChunkMultiplicator: 10
         }),*/
        // uglify
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
    ]);

    // add entry for vendor bundle
    entry["vendor"] = ['jquery']; //add every vendor here

}

entry["app"] = ['./src/js/filter.js'];

module.exports = languages.map(function (lang) {

    return {
        debug: !production, //switch loader to debug mode
        devtool: production ? false : 'eval', //source map generation
        entry: entry,
        output: {
            path: Path.join(__dirname, distFolderPath, lang),
            //hash for long term cache
            filename: production ? 'bundle.[hash].js' : "bundle.js",
            chunkFilename: 'chunk-[id].[hash].js'
        },
        resolve: {
            root: Path.resolve(__dirname),
            alias: {
                module : "bundle.[hash].js",
                css: 'src/css',
                'fx-filter' : 'src'

                //'fx-filter/nls': 'submodules/module_nls/src/nls/' + lang + "/",
                //'fx-filter': 'submodules/module_nls/src',

            }
        },
        module: {
            //jshint
            preLoaders: [
                //jshint
                {
                    test: /\.js$/, // include .js files
                    exclude: /node_modules/, // exclude any and all files in the node_modules folder
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
