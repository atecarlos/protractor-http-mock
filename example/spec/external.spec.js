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
					status: 200
				}
			},
			{
				request: {
					path: '/users',
					method: 'GET',
					params: {
						name: 'External',
						city: 'Query'
					}
				},
				response: {
					data: {
						name: 'Searched external URL'
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

		element(by.id('user-query')).sendKeys('External');
		element(by.id('user-query-city')).sendKeys('Query');
		element(by.id('user-search-external-by-query-button')).click();

		expect(element(by.id('user-data')).getText()).toContain('Searched external URL');
		expect(element(by.id('successMsg')).getText()).toBe('User found: External');
	});
});