var mock = require('../../index'), //substitute for require('protractor-http-mock')
	get = require('./get'); 

describe('requests made', function(){
	
	afterEach(function(){
		mock.teardown();
	});

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
					status: 200
				}
			}
		]);

		get();

		element(by.model('ctrl.newConv')).sendKeys('my new conv');
		element(by.id('conv-save')).click();
		expect(element(by.id('conv-data')).getText()).toBe('get - success!');
	});
});