describe('plugins', function(){
	var module = window.__module, http;

	beforeAll(function(){
		http = window.__getHttp();
	});
	
	it('plugins can match', function(done){
		http({
			method: 'GET',
			url: '/plugin',
			plugin: {}
		}).success(function(data, status){
			expect(data).toBe('plugin match works!');
			expect(status).toBe(200);
			done();
		});
	});
});