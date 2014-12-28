var mock = require('../../index'), //substitute for require('protractor-http-mock')
	get = require('./get'); 

describe('requests made', function(){
	
	afterEach(function(){
		mock.teardown();
	});

	function assertData(expectedData){
		expect(element(by.id('conv-data')).getText()).toBe(expectedData);
	}

	function assertStatus(status){
		expect(element(by.id('conv-status')).getText()).toBe(status.toString());
	}

	it('works with $http convenience methods', function(){
		mock([
			{
				request: {
					path: '/convs',
					method: 'GET'
				},
				response: {
					data: 'get - success!'
				}
			},
			{
				request: {
					path: 'convs/new',
					method: 'POST'
				},
				response: {
					data: 'post - success!',
					status: 201
				}
			},
			{
				request: {
					path: 'convs/2',
					method: 'DELETE'
				},
				response: {
					data: 'delete - success',
					status: 202
				}
			}
		]);

		// get

		get();
		assertData('get - success!');
		assertStatus(200);

		// post
		element(by.model('ctrl.newConv')).sendKeys('my new conv');
		element(by.id('conv-save')).click();
		assertData('post - success!');
		assertStatus(201);
		
		element(by.model('ctrl.idToRemove')).sendKeys('2');
		element(by.id('conv-delete')).click();
		assertData('delete - success');
		assertStatus(202)
	});
});