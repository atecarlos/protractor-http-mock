describe('requests', function(){
	var module = window.__module, http;

	beforeAll(function(){
		http = window.__getHttp();
	});
	
	it('captures and clears requests', function(done){
		http.head('/head').then(function(){
			expect(module.requests.length).toBeGreaterThan(0);

			var found = false;

			module.requests.forEach(function(request){
				if(request.method === 'HEAD'){
					found = true;
					expect(request.url).toBe('/head');
					expect(request.headers).not.toBeDefined();
				}
			});

			expect(found).toBe(true);

			module.clearRequests();
			expect(module.requests.length).toBe(0);
			done();
		});
	});

	it('captures requests with headers', function(done){
		http({
			method: 'get',
			url: '/user',
			headers: {
				'x-auth': 'pass',
				'gzip-pro': 'yes'
			}
		}).then(function(){
			expect(module.requests.length).toBeGreaterThan(0);

			var found = false;

			module.requests.forEach(function(request){
				if(request.headers){
					found = true;
					expect(request.url).toBe('/user');
					expect(request.headers).toEqual({
						'x-auth': 'pass',
						'gzip-pro': 'yes'
					});
				}
			});

			expect(found).toBe(true);
			done();
		});
	});
});