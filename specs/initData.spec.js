'use strict';

var fs = require('fs');
var path = require('path');

var initDataModule = {
	path: '../lib/initData',
	require: function () {
		return require(this.path);
	},
	teardown: function () {
		delete require.cache[require.resolve(this.path)];
	}
};

var defaultConfig = {
	path: path.join(__dirname, '../protractor-conf.js'),
	setup: function () {
		fs.writeFileSync(this.path, 'exports.config = {}');
	},
	teardown: function () {
		fs.unlinkSync(this.path);
	}
};

var globalMocks = {
	setup: function () {
		global.protractor = {};
		global.browser = {
			addMockModule: function () {}
		};
	},
	teardown: function () {
		delete global.protractor;
		delete global.browser;
	}
};


describe('init data', function(){
	beforeEach(function () {
		this.initData = initDataModule.require();
		globalMocks.setup();
		defaultConfig.setup();
	});
	afterEach(function () {
		initDataModule.teardown();
		globalMocks.teardown();
		defaultConfig.teardown();
	});
	it('will not error when not providing config', function () {
		expect(this.initData).not.toThrow();
	});
});
