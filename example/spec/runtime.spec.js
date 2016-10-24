var mock = require('../../index'), //substitute for require('protractor-http-mock')
	get = require('./get'); 

describe('inline', function(){
	
	beforeEach(function(){
		mock([
			{
				request: {
					path: '/users',
					method: 'GET'
				},
				response: {
					data: [
						{
							firstName: 'default',
							lastName: 'value'
						}
					]
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
						name: 'Setup'
					}
				}
			}
		]);

		get();

		mock.add([{
			request: {
				path: '/users',
				method: 'GET',
				params: {
					name: 'Charlie'
				}
			},
			response: {
				data: {
					name: 'Override'
				}
			}
		}]);
	});

	afterEach(function(){
		mock.teardown();
	});

	it('can add mocks', function(){
		element(by.id('user-query')).clear().sendKeys('Charlie');
		element(by.id('user-search-button')).click();

		expect(element(by.id('user-data')).getText()).toContain('Override');
	});

	it('can remove mocks', function(){
		mock.remove([{
			request: {
				path: '/users',
				method: 'GET',
				params: {
					name: 'Charlie'
				}
			},
			response: {
				data: {
					name: 'Override'
				}
			}
		}]);

		element(by.id('user-query')).clear().sendKeys('Charlie');
		element(by.id('user-search-button')).click();

		expect(element(by.id('user-data')).getText()).toContain('Setup');
	});
});