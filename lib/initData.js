'use strict';

var httpMock = require('./httpMock'),
	path = require('path'),
	defaultConfig = require('./defaultConfig');

function readDataModule(mockDirectory, mock){
	return require(path.join(mockDirectory, mock));
}

function getDefaultKeys(mocksConfig){
	return mocksConfig.default && mocksConfig.default.length > 0 ? mocksConfig.default : [];
}

function readModuleConfig(propertyName){
	return module.exports.config[propertyName] || defaultConfig.moduleConfig[propertyName];
}

function getModuleConfig(){
	var moduleConfig = {};
	
	if(module.exports.config){
		moduleConfig.rootDirectory = readModuleConfig('rootDirectory');
		moduleConfig.protractorConfig = readModuleConfig('protractorConfig');
	}else{
		moduleConfig = defaultConfig.moduleConfig; 
	}

	return moduleConfig;
}

function getMocksConfig(moduleConfig){
	var protractorConfigFile = path.join(moduleConfig.rootDirectory, moduleConfig.protractorConfig);
	var mocksConfig = require(protractorConfigFile).config.mocks;

	if(!mocksConfig){
		mocksConfig = defaultConfig.mocksConfig;
	}

	return mocksConfig;
}

function getProtractorInstance(){
	return protractor.getInstance ? protractor.getInstance() : browser;
}

module.exports = function(mocks, skipDefaults){
	var data = [],
		dataModule,
		moduleConfig = getModuleConfig(),
		ptor = getProtractorInstance(),
		mocksConfig = getMocksConfig(moduleConfig),
		mockDirectory = path.join(moduleConfig.rootDirectory, mocksConfig.dir);

	mocks = mocks || [];
	
	if(!skipDefaults){
		mocks = mocks.concat(getDefaultKeys(mocksConfig));
	}

	for(var i = 0; i < mocks.length; i++){
		dataModule = typeof mocks[i] === 'string' ? readDataModule(mockDirectory, mocks[i]) : mocks[i];
		if(Array.isArray(dataModule)){
			data = data.concat(dataModule);
		}else{
			data.push(dataModule);
		}
		
	}

	ptor.addMockModule('httpMock', httpMock(data));
};

module.exports.teardown = function(){
	var ptor = getProtractorInstance();
	ptor.clearMockModules();
};

module.exports.requestsMade = function() {
	return browser.executeAsyncScript(function () {
		var httpMock = angular.module("httpMock");
		var callback = arguments[arguments.length - 1]
		callback(httpMock.requests);
	});
};

module.exports.clearRequests = function(){
	return browser.executeAsyncScript(function () {
		angular.module("httpMock").clearRequests();
		var callback = arguments[arguments.length - 1]
		callback(true);
	});
};