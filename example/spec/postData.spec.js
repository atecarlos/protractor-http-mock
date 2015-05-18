var mock = require('../../index'), //substitute for require('protractor-http-mock')
	get = require('./get'); 

describe('post data', function(){
	afterEach(function(){
		mock.teardown();
	});

	it('matches post data', function(){
		mock([
			{
				request: {
					path: 'users/new',
					method: 'POST'
				},
				response: {
					status: 400,
					data: {
						error: 'generic response'
					}
				}
			},
			{
				request: {
					path: 'users/new',
					method: 'POST',
					data: {
						name: 'Stewie'
					}
				},
				response: {
					status: 200
				}
			},
			{
				request: {
					path: 'users/new',
					method: 'POST',
					data: 'Brian'
				},
				response: {
					status: 500,
					data: { 
						error: 'no dogs allowed!' 
					}
				}
			}
		]);

		get();

		var succElement = element(by.binding('ctrl.success'));
		var errElement = element(by.binding('ctrl.error'));

		element(by.css('.form #save')).click();

		expect(succElement.isDisplayed()).toBe(false);
		expect(errElement.isDisplayed()).toBe(true);
		expect(errElement.getText()).toBe('generic response');

		element(by.model('ctrl.newUser')).sendKeys('Stewie');
		element(by.css('.form #save')).click();
		expect(succElement.isDisplayed()).toBe(true);
		expect(errElement.isDisplayed()).toBe(false);
		expect(succElement.getText()).toBe('new user saved: Stewie');

		element(by.model('ctrl.newUser')).sendKeys('Brian');
		element(by.css('.form #save-name')).click();
		expect(succElement.isDisplayed()).toBe(false);
		expect(errElement.isDisplayed()).toBe(true);
		expect(errElement.getText()).toBe('no dogs allowed!');
	});

	it('matches complex post data', function(){
		mock([
			{
				request: {
					path: 'users/new',
					method: 'POST',
					data: {
						group: 'other group'
					}
				},
				response: {
					status: 500
				}
			},
			{
				request: {
					path: 'users/new',
					method: 'POST',
					data: {
						group: 'default',
						users: [
							{ name: 'One' },
							{ name: 'Two' }
						]
					}
				},
				response: {
					status: 200
				}
			}
		]);

		get();		

		element(by.model('ctrl.newUser')).sendKeys('default');
		element(by.css('.form #add-default')).click();

		var succElement = element(by.binding('ctrl.success'));
		expect(succElement.isDisplayed()).toBe(true);
		expect(succElement.getText()).toBe('new user saved: default');
	});
});