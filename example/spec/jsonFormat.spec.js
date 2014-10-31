var mock = require('../../index'),
	get = require('./get');

describe('from file', function(){
	afterEach(function(){
		mock.teardown();
	});

	it('loads a single mock from file with double quotes', function(){
		mock(['format']);

		get();
		element.all(by.repeater('group in ctrl.groups')).then(function(groups){
			expect(groups.length).toBe(1);
			expect(groups[0].getText()).toBe('format test');
		});
	});
});