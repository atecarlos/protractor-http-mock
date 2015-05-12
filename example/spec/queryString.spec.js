var mock = require('../../index'),
	get = require('./get');

describe('get query strings', function(){
	beforeEach(function(){
		mock([
			{
				request: {
					path: '/users',
					method: 'GET'	
				},
				response: {
					status: 200,
					data: []
				}
			},
			{
				request: {
					path: '/users',
					method: 'GET',
					queryString: {
						name: 'Charlie & Friends',
						city: 'New York'
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
					queryString: {
						name: 'Maria C',
						city: 'Houston'
					}
				},
				response: {
					data: {
						name: 'Maria in Houston'
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

		var searchButton = element(by.id('user-search-by-query-button'));

		element(by.id('user-query')).sendKeys('Charlie & Friends');
		element(by.id('user-query-city')).sendKeys('New York');
		searchButton.click();

		expect(element(by.id('user-data')).getText()).toContain('Charlie');
		expect(element(by.id('successMsg')).getText()).toBe('User found: Charlie & Friends');
		
		element(by.id('user-query')).clear().sendKeys('Maria C');
		element(by.id('user-query-city')).clear().sendKeys('Houston');
		searchButton.click();

		expect(element(by.id('user-data')).getText()).toContain('Maria in Houston');
		expect(element(by.id('successMsg')).getText()).toBe('User found: Maria C');
	});
});