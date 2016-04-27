// Karma configuration
// Generated on Wed Apr 13 2016 14:36:02 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-chrome-storage/angular-chrome-storage.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'app/bower_components/log4javascript/log4javascript.js',
      'app/bower_components/store-js/store.js',
      'app/scripts/app.js',
      'app/scripts/providers/**/*.js',
      'app/scripts/controllers/**/*.js',
      'app/scripts/services/**/*.js',
      'test/spec/providers/**/*.js',
      'test/spec/controllers/**/*.js',
      'test/spec/services/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome_with_extension'],

    // you can define custom flags
    customLaunchers: {
      Chrome_with_extension: {
        base: 'Chrome',
        flags: ['--load-extension=' + __dirname + '/app']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
