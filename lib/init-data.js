'use strict';

var httpMock = require('./http-mock'),
	path = require('path'),
	defaultConfig = require('./default-config');

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

module.exports = function(mocks, skipDefaults){
	var data = [],
		dataModule,
		moduleConfig = getModuleConfig(),
		ptor = protractor.getInstance(),
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
	var ptor = protractor.getInstance();
	ptor.clearMockModules();
};