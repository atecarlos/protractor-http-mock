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

	function setId(val){
		element(by.model('ctrl.id')).clear().sendKeys(val);
	}

	function setInput(val){
		element(by.model('ctrl.input')).clear().sendKeys(val);
	}

	function clearInput(){
		element(by.model('ctrl.input')).clear();
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
					path: '/convs',
					method: 'HEAD'
				},
				response: {
					data: 'head - success!'
				}
			},
			{
				request: {
					path: 'convs/new',
					method: 'POST',
					data: {
						test: 'my new conv'
					}
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
			},
			{
				request: {
					path: 'convs/3',
					method: 'DELETE'
				},
				response: {
					data: 'delete - error',
					status: 400
				}
			},
			{
				request: {
					path: 'convs/3',
					method: 'PUT',
					data: {
						test: 'my updated conv'
					}
				},
				response: {
					data: 'put - success',
					status: 203
				}
			},
			{
				request: {
					path: 'convs/3',
					method: 'PATCH',
					data: {
						test: 'my updated conv'
					}
				},
				response: {
					data: 'patch - error',
					status: 401
				}
			},
			{
				request: {
					path: 'convs/4',
					method: 'PATCH',
					data: {
						test: 'my patched conv'
					}
				},
				response: {
					data: 'patch - success',
					status: 204
				}
			},
			{
				request: {
					path: 'convs',
					method: 'JSONP'
				},
				response: {
					data: 'jsonp - success',
					status: 205
				}
			}
		]);

		// get
		get();
		assertData('get - success!');
		assertStatus(200);

		// head
		element(by.id('conv-head')).click();
		assertData('head - success!');
		assertStatus(200);

		// post
		setInput('my new conv');
		element(by.id('conv-save')).click();
		assertData('post - success!');
		assertStatus(201);
		clearInput();
		
		// delete
		setId('2');
		element(by.id('conv-delete')).click();
		assertData('delete - success');
		assertStatus(202);

		// delete - error
		setId('3');
		element(by.id('conv-delete')).click();
		expect(element(by.id('conv-error')).isDisplayed()).toBe(true);
		assertData('delete - error');
		assertStatus(400);

		// put
		setId('3');
		setInput('my updated conv');
		
		element(by.id('conv-update')).click();
		expect(element(by.id('conv-error')).isDisplayed()).toBe(false);
		assertData('put - success');
		assertStatus(203);

		// patch - error
		element(by.id('conv-patch')).click();
		expect(element(by.id('conv-error')).isDisplayed()).toBe(true);
		assertData('patch - error');
		assertStatus(401);

		clearInput();

		// patch
		setId('4');
		setInput('my patched conv');
		element(by.id('conv-patch')).click();
		assertData('patch - success');
		assertStatus(204);

		// jsonp
		setId('5');
		element(by.id('conv-jsonp')).click();
		assertData('jsonp - success');
		assertStatus(205);
	});
});