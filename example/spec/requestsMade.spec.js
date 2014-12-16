var mock = require('../../index'), //substitute for require('protractor-http-mock')
	get = require('./get'); 

describe('requests made', function(){
	
	afterEach(function(){
		mock.teardown();
	});

	it('can evaluate requests made', function(){
		mock([{
			request: {
				path: 'users/new',
				method: 'POST'
			},
			response: {
				status: 200
			}
		}]);

		get();

		element(by.model('ctrl.newUser')).sendKeys('my-new-user');
		element(by.css('.form button')).click();

		expect(mock.requestsMade()).toEqual([
			{ url : '/default', method : 'GET' },
			{ data : { name : 'my-new-user' }, url : '/users/new', method : 'POST' }
		]);
	})
});