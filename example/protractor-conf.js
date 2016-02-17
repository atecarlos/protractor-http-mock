var config = {
    baseUrl: 'http://localhost:8000/',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
      'spec/*.spec.js'
    ],
    mocks: {
      dir: 'mocks',
      default: ['default']
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
    'phantomjs.binary.path': require('phantomjs').path,
    'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG'],
    shardTestFiles: true,
    maxInstances: 2
  };
} else {
  config.capabilities = {
    browserName: 'chrome'
  }
  config.chromeDriver= '../node_modules/protractor/selenium/chromedriver';
}
exports.config = config;
