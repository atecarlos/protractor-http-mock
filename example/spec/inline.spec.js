var mock = require('../../index'); //substitute for require('protractor-http-mock')

describe('inline', function(){
	
	var URL = 'http://localhost:8000';

	afterEach(function(){
	  	mock.teardown();
	});

	describe('success', function(){
		it('can set a single mock inline', function(){
			mock([{
				request: {
					path: '/users',
					method: 'GET'
				},
				response: {
					data: [
						{
							firstName: 'carlos',
							lastName: 'npm'
						},
						{
							firstName: 'angular',
							lastName: 'js'
						}
					]
				}
			}]);

			browser.get(URL);
			expect(browser.getTitle()).toBe('Protractor Http Mock - Example');
			var users = element.all(by.repeater('user in ctrl.users'));
			expect(users.count()).toBe(2);
		});
	});

	describe('error', function(){
		it('can set a single mock inline', function(){
			mock([{
				request: {
					path: '/users'
				},
				response: {
					status: 500,
					data: {
						error: 'oh no!'
					}
				}
			}]);

			browser.get(URL);
			var users = element.all(by.repeater('user in ctrl.users'));
			expect(users.count()).toBe(0);
			expect(element(by.binding('ctrl.error')).isDisplayed()).toBe(true);
		});
	});
});