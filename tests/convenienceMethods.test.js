describe('convenience methods', function(){
	var module = window.__module, http;

	beforeAll(function(){
		http = window.__getHttp();
	});
	
	it('get', function(done){
		http.get('test-api.com/user').then(function(response){
			expect(response.data).toBe('pass');
			done();
		});
	});

	it('post', function(done){
		http.post('/user', {
			name: 'Carlos'
		}).then(function(response){
			expect(response.data).toBe('Carlos has been saved');
			done();
		});
	});

	it('head', function(done){
		http.head('/head').then(function(response){
			expect(response.data).toBe('head response');
			done();
		});
	});

	it('put', function(done){
		http.put('/put').then(function(response){
			expect(response.data).toBe('put response');
			done();
		});
	});

	it('delete', function(done){
		http.delete('/delete').then(function(response){
			expect(response.data).toBe('delete response');
			done();
		});
	});

	it('jsonp', function(done){
		http.jsonp('/jsonp').then(function(response){
			expect(response.data).toBe('jsonp response');
			done();
		});
	});
});