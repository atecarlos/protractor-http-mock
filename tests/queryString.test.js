describe('query string', function(){
	var module = window.__module, http;

	beforeAll(function(){
		http = window.__getHttp();
	});
	
	it('matches by query string', function(done){
		http.get('github.com/user/search?id=1&city=ny%26ny').then(function(response){
			expect(response.data.name).toBe('Carlos QS');
			done();
		});
	});

	it('query string is optional in the mock config', function(done){
		http.get('github.com/user/search?id=2&city=another').then(function(response){
			expect(response.data.name).toBe('Whatever you search');
			done();
		});
	});
});