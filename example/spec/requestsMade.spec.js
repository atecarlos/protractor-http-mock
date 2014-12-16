var mock = require('../../index'), //substitute for require('protractor-http-mock')
	get = require('./get'); 

describe('requests made', function(){
	
	afterEach(function(){
		mock.teardown();
	});

	it('can evaluate requests made', function(){
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

		get();

		expect(mock.requestsMade()).toEqual([
			{ url : '/default', method : 'GET' },
			{ url : '/users', method : 'GET' }
		]);
	})
});