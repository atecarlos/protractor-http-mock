var mock = require('../../index'), //substitute for require('protractor-http-mock')
	get = require('./get'); 

describe('inline', function(){
	
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

			get();
			expect(browser.getTitle()).toBe('Protractor Http Mock - Example');
			
			element.all(by.repeater('user in ctrl.users')).then(function(users){
				expect(users.length).toBe(2);
				expect(users[0].getText()).toBe('carlos | npm');
				expect(users[1].getText()).toBe('angular | js');	
			});

			expect(element(by.binding('ctrl.error')).isDisplayed()).toBe(false);
		});

		it('can set multiple mocks inline', function(){
			mock([
				{
					request: {
						path: '/users',
						method: 'GET'
					},
					response: {
						data: [
							{
								firstName: 'multiple',
								lastName: 'mocks'
							}
						]
					}
				},
				{
					request: {
						path: '/groups',
						method: 'GET'
					},
					response: {
						data: [
							{ name: 'first' },
							{ name: 'second' }
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

			element.all(by.repeater('user in ctrl.users')).then(function(users){
				expect(users.length).toBe(1);
				expect(users[0].getText()).toBe('multiple | mocks');
			});

			element.all(by.repeater('group in ctrl.groups')).then(function(groups){
				expect(groups.length).toBe(2);
				expect(groups[0].getText()).toBe('first');
				expect(groups[1].getText()).toBe('second');
			});

			expect(element(by.binding('ctrl.error')).isDisplayed()).toBe(false);

			element(by.model('ctrl.newUser')).sendKeys('my-new-user');
			element(by.css('.form #save')).click();

			var succElement = element(by.binding('ctrl.success'));
			expect(succElement.isDisplayed()).toBe(true);
			expect(succElement.getText()).toBe('new user saved: my-new-user');
		});
	});

	describe('error', function(){
		it('can set a single mock inline', function(){
			mock([{
				request: {
					path: '/users',
					method: 'GET'
				},
				response: {
					status: 500,
					data: {
						error: 'oh no!'
					}
				}
			}]);

			get();
			var users = element.all(by.repeater('user in ctrl.users'));
			expect(users.count()).toBe(0);
			var errElement = element(by.binding('ctrl.error'));
			expect(errElement.isDisplayed()).toBe(true);
			expect(errElement.getText()).toBe('oh no!');
		});

		it('can set multiple mocks inline', function(){
			mock([
				{
					request: {
						path: '/users',
						method: 'GET'
					},
					response: {
						status: 500,
						data: {
							error: 'help!'
						}
					}
				},
				{
					request: {
						path: '/groups',
						method: 'GET'
					},
					response: {
						status: 200,
						data: [ { name: 'i did work' }]
					}
				},
				{
					request: {
						path: '/users/new',
						method: 'POST',
						data: {}
					},
					response: {
						status: 500,
						data: {
							error: 'post error!'
						}
					}
				}
			]);

			get();

			var users = element.all(by.repeater('user in ctrl.users'));
			expect(users.count()).toBe(0);

			var groups = element.all(by.repeater('group in ctrl.groups'));
			expect(groups.count()).toBe(1);

			var errElement = element(by.binding('ctrl.error'));
			expect(errElement.isDisplayed()).toBe(true);
			expect(errElement.getText()).toBe('help!');

			element(by.css('.form #save')).click();
			expect(errElement.getText()).toBe('post error!');
		});
	});
});