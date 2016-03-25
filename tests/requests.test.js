describe('requests', function(){
	var module = window.__module, http;

	beforeAll(function(){
		http = window.__getHttp();
	});
	
	it('captures and clears requests', function(done){
		http({
			method: 'GET',
			url: 'test-api.com/user'
		});

		http.head('/head').then(function(){
			expect(module.requests.length).toBeGreaterThan(1);

			var found = false;

			module.requests.forEach(function(request){
				if(request.method === 'HEAD'){
					found = true;
					expect(request.url).toBe('/head');
				}
			});

			expect(found).toBe(true);

			module.clearRequests();
			expect(module.requests.length).toBe(0);
			done();
		});
	});
});