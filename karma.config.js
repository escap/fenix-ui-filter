var Path = require('path'),
    webpackConfig = require('./webpack.config');

var preprocessors = {};
preprocessors[Path.resolve(__dirname, './test/*.js')] = ['webpack'];
preprocessors[Path.resolve(__dirname, './src/*.js')] = ['webpack'];

module.exports = function (config) {

    config.set({

        basePath: Path.resolve(__dirname, './src/js'),

        frameworks: ['chai', 'mocha'],

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatchBatchDelay: 300,

        files: [
            Path.resolve(__dirname, "./dist/*.js"),
            Path.resolve(__dirname, "./test/*.js")
        ],

        exclude: [],

        preprocessors: preprocessors,

        webpack: webpackConfig,
        webpackMiddleware: {
            noInfo: true
        },

        //autoWatch: !ci,

        browsers: ['Chrome'], //['Firefox'],

        singleRun: true,

        browserNoActivityTimeout: 180000,

        plugins: [
            'karma-webpack',
            'karma-mocha',
            'karma-chai',
            'karma-coverage',
            'karma-chrome-launcher',
            'karma-firefox-launcher'
        ]
    });
};


// utils

function isTest(valid, invalid) {

    return isEnvironment('develop') ? valid : invalid;
}

function isEnvironment(env) {
    return process.env.NODE_ENV === env;
}

/* Coverage and report

//
/!*reporters: getReporters(),
 coverageReporter: {
 reporters: [
 {type: 'lcov', dir: 'coverage/', subdir: '.'},
 {type: 'json', dir: 'coverage/', subdir: '.'},
 {type: 'text-summary'}
 ]
 },*!/

function getReporters() {
    var reps = ['progress'];
    if (coverage) {
        reps.push('coverage');
    }
    return reps;
}*/
