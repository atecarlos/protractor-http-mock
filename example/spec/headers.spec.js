var mock = require('../../index'), //substitute for require('protractor-http-mock')
	get = require('./get'); 

describe('headers', function(){
	
	afterEach(function(){
		mock.teardown();
	});

	it('matchers with headers', function(){
		mock([
			{
				request: {
					path: '/users',
					method: 'get'
				},
				response: {
					status: 403,
					data: {
						error: 'not authorized'
					}
				}
			},
			{
				request: {
					path: '/users',
					method: 'get',
					headers: {
						auth: true
					}
				},
				response: {
					data: [
						{
							firstName: 'auth',
							lastName: 'one'
						},
						{
							firstName: 'auth',
							lastName: 'two'
						}
					]
				}
			}
		]);

		get();

		element(by.id('user-get-authenticated-button')).click();

		var users = element.all(by.repeater('user in ctrl.users'));

		expect(users.count()).toBe(0);
		var errElement = element(by.binding('ctrl.error'));
		expect(errElement.isDisplayed()).toBe(true);
		expect(errElement.getText()).toBe('not authorized');

		element(by.id('user-select-authenticated')).click();
		element(by.id('user-get-authenticated-button')).click();

		element.all(by.repeater('user in ctrl.users')).then(function(users){
			expect(users.length).toBe(2);
			expect(users[0].getText()).toBe('auth | one');
			expect(users[1].getText()).toBe('auth | two');
		});
	});
});