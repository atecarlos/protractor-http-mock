var mock = require('../../index'), //substitute for require('protractor-http-mock')
	get = require('./get'); 

describe('requests made', function(){
	
	afterEach(function(){
		mock.teardown();
	});

	beforeEach(function(){
		mock([
			{
				request: {
					path: '/users',
					method: 'GET',
					plugin: {
						check: true
					}
				},
				response: {
					data: 'from sample plugin match'
				}
			},
			{
				request: {
					path: '/users',
					method: 'GET',
					plugin: {
						check: false
					}
				},
				response: {
					data: 'my plugin should not match here!'
				}
			}
		]);

		get();
	});

	it('can match through plugin', function(){
		element(by.id('plugin-request')).click();
		expect(element(by.id('plugin-result')).getText()).toBe('from sample plugin match');
	});
});