'use strict';

var httpMock = require('./http-mock'),
	path = require('path');

function getRoot(){
	return module.exports.config ? module.exports.config.dir : process.cwd();
}

function getProtractorConf() {
    return module.exports.config ? module.exports.config.protractorConf : 'protractor.conf';
}

function readDataModule(mockDirectory, mock){
	return require(path.join(mockDirectory, mock));
}

function getDefaultKeys(config){
	return config.mocks.default && config.mocks.default.length > 0 ? config.mocks.default : [];
}

module.exports = function(mocks, skipDefaults){
	var data = [],
		dataModule,
		ptor = protractor.getInstance(),
		root = getRoot(),
		config = require(path.join(root, getProtractorConf())).config,
		mockDirectory = path.join(root, config.mocks.dir);

	mocks = mocks || [];
	
	if(!skipDefaults){
		mocks = mocks.concat(getDefaultKeys(config));
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