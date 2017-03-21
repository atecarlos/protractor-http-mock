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
					method: 'POST',
					data: {
						name: 'my-new-user'
					}
				},
				response: {
					status: 200
				}
			}
		]);

		get();
	});

	it('can evaluate requests made', function(){
		expect(mock.requestsMade()).toEqual([
			{ url : '/default', method : 'GET', mock: 1 },
			{ url : '/users', method : 'GET', mock: 1 }
		]);
		
		element(by.model('ctrl.newUser')).sendKeys('my-new-user');
		element(by.css('.form #save')).click();

		expect(mock.requestsMade()).toEqual([
			{ url : '/default', method : 'GET', mock: 1 },
			{ url : '/users', method : 'GET', mock: 1 },
			{ data : { name : 'my-new-user' }, url : '/users/new', method : 'POST', mock: 1 }
		]);
	});

	it('can evaluate just the last request made', function(){
		mock.requestsMade().then(function(requests){
			expect(requests[1]).toEqual({ url : '/users', method : 'GET', mock: 1 })
		});
	});

	it('can clear requests', function(){
		mock.clearRequests();
		expect(mock.requestsMade()).toEqual([]);

		element(by.model('ctrl.newUser')).sendKeys('my-new-user');
		element(by.css('.form #save')).click();

		mock.clearRequests();
		expect(mock.requestsMade()).toEqual([]);
	});
});