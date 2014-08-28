'use strict';

var httpMock = require('./http-mock'),
	path = require('path'),
	defaultModuleConfig = require('./default-config');

function readDataModule(mockDirectory, mock){
	return require(path.join(mockDirectory, mock));
}

function getDefaultKeys(config){
	return config.mocks.default && config.mocks.default.length > 0 ? config.mocks.default : [];
}

function readConfigProperty(propertyName){
	return module.exports.config[propertyName] || defaultModuleConfig[propertyName];
}

function getModuleConfig(){
	var moduleConfig = {};
	
	if(module.exports.config){
		moduleConfig.rootDirectory = readConfigProperty('rootDirectory');
		moduleConfig.protractorConfig = readConfigProperty('protractorConfig');
	}

	return moduleConfig;
}

module.exports = function(mocks, skipDefaults){
	var data = [],
		dataModule,
		moduleConfig = getModuleConfig(),
		ptor = protractor.getInstance(),
		executionConfig = require(path.join(moduleConfig.rootDirectory, moduleConfig.protractorConfig)).config,
		mockDirectory = path.join(moduleConfig.rootDirectory, executionConfig.mocks.dir || 'mocks');

	mocks = mocks || [];
	
	if(!skipDefaults){
		mocks = mocks.concat(getDefaultKeys(executionConfig));
	}

	for(var i = 0; i < mocks.length; i++){
		dataModule = typeof mocks[i] === 'string' ? readDataModule(mockDirectory, mocks[i]) : mocks[i];
		data.push(dataModule);
	}

	ptor.addMockModule('httpMock', httpMock(data));
};

module.exports.teardown = function(){
	var ptor = protractor.getInstance();
	ptor.clearMockModules();
};