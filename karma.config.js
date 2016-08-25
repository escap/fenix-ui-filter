var Path = require('path');

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

var coverage = process.env.COVERAGE === 'true';
var ci = process.env.NODE_ENV === 'test:ci';
if (coverage) {
    console.log('-- recording coverage --');
}

var webpackConfig = require('./webpack.config');

var preprocessors = {};
preprocessors[Path.resolve(__dirname, './test/**/*.js')] = ['webpack'];
preprocessors[Path.resolve(__dirname, './src/**/*.js')] = ['webpack'];

module.exports = function (config) {
    config.set({
        basePath: Path.resolve(__dirname, './src/js'),
        frameworks: ['chai', 'mocha'],
        //reporters: getReporters(),
        port: 9876,
        colors: true,
        //logLevel: config.LOG_INFO,
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
/*        coverageReporter: {
            reporters: [
                {type: 'lcov', dir: 'coverage/', subdir: '.'},
                {type: 'json', dir: 'coverage/', subdir: '.'},
                {type: 'text-summary'}
            ]
        },*/
        autoWatch: !ci,
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

function getReporters() {
    var reps = ['progress'];
    if (coverage) {
        reps.push('coverage');
    }
    return reps;
}