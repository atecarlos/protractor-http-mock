var mock = require('../../index'), //substitute for require('protractor-http-mock')
	get = require('./get'); 

describe('casing', function(){
	
	afterEach(function(){
		mock.teardown();
	});

	it('ignores casing for request method', function(){
		mock([
			{
				request: {
					path: '/users',
					method: 'get'
				},
				response: {
					data: [
						{
							firstName: 'multiple',
							lastName: 'mocks'
						}
					]
				}
			}
		]);

		get();

		element.all(by.repeater('user in ctrl.users')).then(function(users){
			expect(users.length).toBe(1);
			expect(users[0].getText()).toBe('multiple | mocks');
		});
	});
});