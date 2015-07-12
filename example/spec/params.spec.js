var mock = require('../../index'),
	get = require('./get');

describe('get by params', function(){
	beforeEach(function(){
		mock([
			{
				request: {
					path: '/users',
					method: 'GET'	
				},
				response: {
					status: 200
				}
			},
			{
				request: {
					path: '/users',
					method: 'GET',
					params: {
						name: 'unknown'
					}
				},
				response: {
					status: 500,
					data: {
						error: 'no user found'
					}
				}
			},
			{
				request: {
					path: '/users',
					method: 'GET',
					params: {
						name: 'Charlie'
					}
				},
				response: {
					data: {
						name: 'Charlie'
					}
				}
			},
			{
				request: {
					path: '/users',
					method: 'GET',
					params: {
						name: 'Charlie',
						city: 'Houston'
					}
				},
				response: {
					data: {
						name: 'Charlie in Houston'
					}
				}
			}
		]);
	});

	afterEach(function(){
		mock.teardown();
	});

	it('matches by params', function(){
		get();

		var searchButton = element(by.id('user-search-button'));

		element(by.id('user-query')).sendKeys('Charlie');
		searchButton.click();

		expect(element(by.id('user-data')).getText()).toContain('Charlie');
		expect(element(by.id('successMsg')).getText()).toBe('User found: Charlie');

		element(by.id('user-query-city')).sendKeys('Houston');
		searchButton.click();

		expect(element(by.id('user-data')).getText()).toContain('Charlie in Houston');
		expect(element(by.id('successMsg')).getText()).toBe('User found: Charlie');

		element(by.id('user-query')).clear().sendKeys('unknown');
		element(by.id('user-query-city')).clear();
		searchButton.click();

		var errElement = element(by.id('errorMsg'));
		expect(errElement.isDisplayed()).toBe(true);
		expect(errElement.getText()).toBe('no user found');
	});
});