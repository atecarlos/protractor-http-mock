var mock = require('../../index'),
	get = require('./get');

describe('default file', function(){
	afterEach(function(){
		mock.teardown();
	});

	it('loads a single mock from file', function(){
		mock();
		get();
		expect(browser.getTitle()).toBe('Protractor Http Mock - Example');
		expect($('#default-name').getText()).toBe("i'm always loaded");
	});
});