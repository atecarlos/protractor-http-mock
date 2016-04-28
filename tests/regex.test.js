describe('regex match', function(){
	var http;

	beforeAll(function(){
		http = window.__getHttp();
	});

	it('matches any', function(done){
		http.get('/regex/d3ce5994-e662-4223-9968-9fc01694f08f').then(function(response){
			expect(response.data).toBe('regex any match');
			done();
		});
	});

	it('matches number', function(done){
		http.get('/regex/1').then(function(response){
			expect(response.data).toBe('regex number match');
			done();
		});
	});
});
