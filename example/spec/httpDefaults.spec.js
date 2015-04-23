var mock = require('../../index'),
	get = require('./get');

describe('http defaults', function(){
	afterEach(function(){
		mock.teardown();
	});

	it('loads http defaults', function(){
		mock();
		get();
		expect(element(by.id('http-defaults')).isDisplayed()).toBe(true);
	});
});