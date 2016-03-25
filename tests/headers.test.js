describe('headers', function(){
	var module = window.__module, http;

	beforeAll(function(){
		http = window.__getHttp();
	});

	it('matches a request by headers', function(done){
		http({
			method: 'get',
			url: 'my-api.com/user',
			headers: {
				'x-auth': 'pass',
				'gzip-pro': 'yes'
			}
		}).then(function(response){
			expect(response.data).toBe('authentication passed');
			done();
		});
	});

	it('can respond with headers', function(done){
		http({
			url: 'my-api.com/with-headers',
			method: 'get'
		}).then(function(response){
			expect(response.headers('X-AUTH')).toBe('authenticated');
			expect(response.headers('ANGULAR_API')).toBe('ang=api');
			done();
		});
	});

	it('can respond with headers in convenience methods', function(done){
		http({
			url: 'my-api.com/with-headers',
			method: 'get'
		}).success(function(data, status, headers){
			expect(headers('X-AUTH')).toBe('authenticated');
			expect(headers('ANGULAR_API')).toBe('ang=api');
			done();
		});
	});

	it('ignores header properties when their function return value is null', function(done){
		http({
			method: 'get',
			url: 'my-api.com/user',
			headers: {
				'x-auth': 'pass',
				'gzip-pro': 'yes',
				'ignore-me': function(){
					return null;
				}
			}
		}).then(function(response){
			expect(response.data).toBe('authentication passed');
			done();
		});
	});

	it('always returns a header', function(done){
		http({
			method: 'GET',
			url: 'test-api.com/user'
		}).then(function(response){
			expect(response.headers).toBeDefined();
			expect(response.data).toBe('pass');
			done();
		});
	});

	it('matches request by complex headers (include functions)', function(done){
		http({
			method: 'get',
			url: 'my-api.com/user',
			headers: {
				'x-auth': 'pass',
				'gzip-pro': function(config){
					if(config){
						return 'yes';
					}
				}
			}
		}).then(function(response){
			expect(response.data).toBe('authentication passed');
			done();
		});
	});

	it('response headers function returns all headers if no provided header name', function(done){
		var expectedHeaders = {
			'X-AUTH': 'authenticated',
			'ANGULAR_API': 'ang=api'
		};

		http({
			url: 'my-api.com/with-headers',
			method: 'get'
		}).then(function(response){
			expect(response.headers()).toEqual(expectedHeaders);
			expect(response.headers(null)).toEqual(expectedHeaders);
			expect(response.headers(undefined)).toEqual(expectedHeaders);
			done();
		});
	});
});