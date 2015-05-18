'use strict';

var httpMock = require('../lib/httpMock');

describe('http mock', function(){
	it('sets expectations', function(){
		var expectations = [
			{
				one: 'mock-one'
			},
			{
				two: 'mock-two'
			}
		];

		var result = httpMock(expectations);
		expect(typeof result).toBe('function');
		expect(result.toString()).toContain('var expectations = [{"one":"mock-one"},{"two":"mock-two"}]');
	});

	it('sets query string function', function(){
		var expectations = [];

		var result = httpMock(expectations);
		expect(result.toString()).toContain('decodeURIComponent');
	});
});