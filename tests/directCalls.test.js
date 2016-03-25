describe('direct calls', function(){
	var module = window.__module, http;

	beforeAll(function(){
		http = window.__getHttp();
	});
	
	describe('get', function(){
		it('captures a simple get call', function(done){
			http({
				method: 'GET',
				url: 'test-api.com/user'
			}).then(function(response){
				expect(response.data).toBe('pass');
				done();
			});
		});

		it('captures get with provided params', function(done){
			http({
				method: 'GET',
				url: '/user',
				params: {
					id: 1
				}
			}).then(function(response){
				expect(response.data.name).toBe('Carlos Github');
				done();
			});
		});

		it('treats params get with provided params', function(done){
			http({
				method: 'GET',
				url: '/user',
				params: {
					id: 2
				}
			}).then(function(response){
				expect(response.data).toBe('pass');
				done();
			});
		});

		it('treats requests as GET by default', function(done){
			http({
				url: '/user',
				params: {
					id: 2
				}
			}).then(function(response){
				expect(response.data).toBe('pass');
				done();
			});
		});
	});

	describe('post', function(){
		it('captures post calls', function(done){
			http({
				method: 'POST',
				url: '/user',
				data: {
					name: 'Carlos'
				}
			}).then(function(response){
				expect(response.data).toBe('Carlos has been saved');
				done();
			});
		});

		it('captures expected post errors', function(done){
			http({
				method: 'POST',
				url: '/user',
				data: {
					name: 'Other name'
				}
			}).catch(function(response){
				expect(response.status).toBe(500);
				expect(response.data.error).toBe('Cant save other users');
				done();
			});
		});

		it('treats data as optional field', function(done){
			http({
				method: 'POST',
				url: '/user',
				data: {
					some: 'thing'
				}
			}).then(function(response){
				expect(response.data).toBe('Generic match');
				done();
			});
		});
	});
});