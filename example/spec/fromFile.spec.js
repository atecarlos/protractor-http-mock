var mock = require('../../index'),
	get = require('./get');

describe('from file', function(){
	afterEach(function(){
		mock.teardown();
	});

	it('loads a single mock from file', function(){
		mock(['users']);

		get();

		expect(browser.getTitle()).toBe('Protractor Http Mock - Example');
			
		element.all(by.repeater('user in ctrl.users')).then(function(users){
			expect(users.length).toBe(2);
			expect(users[0].getText()).toBe('from | file');
			expect(users[1].getText()).toBe('second | from file');	
		});
	});
});