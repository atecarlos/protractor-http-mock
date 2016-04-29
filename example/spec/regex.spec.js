var mock = require('../../index'),
	get = require('./get');

describe('match path with regex', function(){
	beforeEach(function(){
		mock([
			{
				request: {
					path: '\\/users\\/[0-9]',
					method: 'GET',
					regex: true
				},
				response: {
					status: 200,
					data: {
						name: 'User with int id'
					}
				}
			},
			{
				request: {
					path: '\\/users\\/[^0-9]',
					method: 'GET',
					regex: true
				},
				response: {
					status: 400,
					data: {
						error: 'Not a number'
					}
				}
			}
		]);
	});

	afterEach(function(){
		mock.teardown();
	});

	it('match on int id', function(){
		get();

		var searchButton = element(by.id('user-search-by-id-button'));

		element(by.id('user-query')).sendKeys('1');
		searchButton.click();

		expect(element(by.id('user-data')).getText()).toContain('User with int id');

		element(by.id('user-query')).clear().sendKeys('abc');
		searchButton.click();

		expect(element(by.id('errorMsg')).getText()).toBe('Not a number');
	});
});
