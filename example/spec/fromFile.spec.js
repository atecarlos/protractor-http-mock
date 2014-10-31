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

	it('loads multiple from a file', function(){
		mock(['multiple']);

		get();

		element.all(by.repeater('user in ctrl.users')).then(function(users){
			expect(users.length).toBe(1);
			expect(users[0].getText()).toBe('multiple | from file');
		});

		element.all(by.repeater('group in ctrl.groups')).then(function(groups){
			expect(groups.length).toBe(2);
			expect(groups[0].getText()).toBe('file first');
			expect(groups[1].getText()).toBe('file second');
		});
	});
});