var config = {
    directConnect: true,
    baseUrl: 'http://localhost:8000/',
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
  // Run FF on Travis
  config.capabilities = {
    browserName: 'firefox'
  };
} else {
  config.capabilities = {
    browserName: 'chrome'
  }
  config.chromeDriver= '../node_modules/protractor/selenium/chromedriver';
}
exports.config = config;
