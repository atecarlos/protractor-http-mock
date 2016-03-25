describe('transforms', function(){
	var module = window.__module, http;

	beforeAll(function(){
		http = window.__getHttp();
	});
	
	it('allows multiple transform requests', function(done){
		http.post('test-url.com/transform-request', {
				name: 'transform test'
			}, {
			transformRequest: [function(data){
				data.city = 'test city';
				return data;
			}, function(data){
				data.name = 'test';
				return data;
			}]
		}).then(function(response){
			expect(response.data.name).toBe('multiple transforms request test');
			done();
		});
	});

	it('allows a single transform requests', function(done){
		http.post('test-url.com/transform-request', {
				name: 'transform test'
			}, {
			transformRequest: function(data){
				data.name = 'test';
				return data;
			}
		}).then(function(response){
			expect(response.data.name).toBe('transform request test');
			done();
		});
	});

	it('allows multiple transform responses', function(done){
		http({
			method: 'GET',
			url: 'test-url.com/transform-response',
			transformResponse: [function (data){
				data.name = 'transform response test';
				return data;
			}, function(data){
				data.city = 'test response city';
				return data;
			}]
		}).then(function(response){
			expect(response.data.name).toBe('transform response test');
			expect(response.data.city).toBe('test response city');
			done();
		});
	});

	it('allows a single transform responses', function(done){
		http({
			method: 'GET',
			url: 'test-url.com/transform-response',
			transformResponse: function (data){
				data.name = 'transform response test';
				return data;
			}
		}).then(function(response){
			expect(response.data.name).toBe('transform response test');
			done();
		});
	});
});