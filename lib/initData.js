/* globals browser */
'use strict';

var httpMock = require('./httpMock'),
	path = require('path'),
	defaultConfig = require('./defaultConfig');

function getConfig(){
	var config = defaultConfig;

	if(module.exports.config){
		config.rootDirectory = module.exports.config.rootDirectory || config.rootDirectory;
		config.protractorConfig = module.exports.config.protractorConfig || config.protractorConfig;
	}

	var protractorConfigFile = path.join(config.rootDirectory, config.protractorConfig);
	var protractorConfig = require(protractorConfigFile).config;

	config.mocks = protractorConfig.mocks || defaultConfig.mocks;
	// TODO: add validation check
	config.mocks.default = config.mocks.default || [];

	config.plugins = protractorConfig.httpMockPlugins || defaultConfig.plugins;
	// TODO: add validation check
	config.plugins.default = config.plugins.default || [];

	return config;
}

function readMockFile(mockDirectory, mock){
	return require(path.join(mockDirectory, mock));
}

function buildMocks(mocks, skipDefaults){
	var data = [],
		config = getConfig(),
		mockDirectory = path.join(config.rootDirectory, config.mocks.dir);

	mocks = mocks || [];

	if(!skipDefaults){
		mocks = config.mocks.default.concat(mocks);
	}

	for(var i = 0; i < mocks.length; i++){
		// TODO: add validation check
		var dataModule = typeof mocks[i] === 'string' ? readMockFile(mockDirectory, mocks[i]) : mocks[i];

		if(Array.isArray(dataModule)){
			data = data.concat(dataModule);
		}else{
			data.push(dataModule);
		}

	}

	return data;
}

function buildPlugins(plugins, skipDefaults){
	var data = [],
		config = getConfig();

	plugins = plugins || [];

	if(!skipDefaults){
		plugins = config.plugins.default.concat(plugins);
	}

	for(var i = 0; i < plugins.length; i++){
		// TODO: add validation check
		var plugin = typeof plugins[i] === 'string' ? require(plugins[i]) : plugins[i];
		data.push(plugin);
	}

	return data;
}

function getProtractorInstance(){
	return protractor.getInstance ? protractor.getInstance() : browser;
}

module.exports = function(mocks, plugins, skipDefaults){
	var builtMocks = buildMocks(mocks, skipDefaults),
		builtPlugins = buildPlugins(plugins);

	var ptor = getProtractorInstance();
	ptor.addMockModule('httpMock', httpMock(builtMocks, builtPlugins));
};

module.exports.teardown = function(){
	var ptor = getProtractorInstance();
	ptor.removeMockModule('httpMock');
};

module.exports.requestsMade = function() {
	return browser.executeAsyncScript(function () {
		var httpMock = angular.module('httpMock');
		var callback = arguments[arguments.length - 1];
		callback(httpMock.requests);
	});
};

module.exports.clearRequests = function(){
	return browser.executeAsyncScript(function () {
		angular.module('httpMock').clearRequests();
		var callback = arguments[arguments.length - 1];
		callback(true);
	});
};

module.exports.add = function(mocks){
	return browser.executeAsyncScript(function () {
		angular.module('httpMock').addMocks(arguments[0]);
		var callback = arguments[arguments.length - 1];
		callback(true);
	}, mocks);
};

module.exports.remove = function(mocks){
	return browser.executeAsyncScript(function () {
		angular.module('httpMock').removeMocks(arguments[0]);
		var callback = arguments[arguments.length - 1];
		callback(JSON.stringify(true));
	}, mocks);
};
