describe('$http promises', function(){
	var module = window.__module, http;

	beforeAll(function(){
		http = window.__getHttp();
	});
	
	it('handles success callback', function(done){
		http({
			method: 'GET',
			url: 'test-api.com/user'
		}).success(function(data, status){
			expect(data).toBe('pass');
			expect(status).toBe(200);
			done();
		});
	});

	it('handles error callback', function(done){
		http.post('test-api.com/user', {
			name: 'Other name'
		}).error(function(data, status){
			expect(status).toBe(500);
			expect(data.error).toBe('Cant save other users');
			done();
		});
	});
});