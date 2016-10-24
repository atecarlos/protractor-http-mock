var config = {
    baseUrl: 'http://localhost:8000/',
    specs: [
      'spec/*.spec.js'
    ],
    mocks: {
      dir: 'mocks',
      default: ['default']
    },
    httpMockPlugins: {
      default: ['protractor-http-mock-sample-plugin']
    },
    onPrepare: function(){
      require('../index').config = {
        rootDirectory: __dirname
      }
    }
};

if (process.env.TRAVIS) {
    //Run PhantomJS on Travis
    config.capabilities = {
        browserName: 'phantomjs',
        'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG'],
        shardTestFiles: true,
        maxInstances: 2
    };
} else {
    config.capabilities = {
      browserName: 'chrome'
    };
}
exports.config = config;