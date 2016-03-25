describe('external url', function(){
	var module = window.__module, http;

	beforeAll(function(){
		http = window.__getHttp();
	});

	it('should match against external URLs', function(done){
		http({
			method: 'GET',
			url: 'https://test-api.com/user'
		}).then(function(response){
			expect(response.data).toBe('pass');
			done();
		});
	});
});