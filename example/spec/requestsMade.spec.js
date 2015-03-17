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
			},
			{
				request: {
					path: 'users/new',
					method: 'POST'
				},
				response: {
					status: 200
				}
			}
		]);

		get();		
	});

	it('can evaluate requests made', function(){
		element(by.model('ctrl.newUser')).sendKeys('my-new-user');
		element(by.css('.form #save')).click();

		expect(mock.requestsMade()).toEqual([
			{ url : '/default', method : 'GET' },
			{ url : '/users', method : 'GET' },
			{ data : { name : 'my-new-user' }, url : '/users/new', method : 'POST' }
		]);
	});

	// todo: finish this spec
	// add clear functionality.
	// add this new feature to docs.
	// publish new version
	it('can clear requests', function(){
		mock.clearRequests();
		expect(mock.requestsMade()).toEqual([]);
	});
});