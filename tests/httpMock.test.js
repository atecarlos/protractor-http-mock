describe('http mock', function(){
	var http = null;

	function configureMock(){
		var mock = window.httpMock([
			{
				request: {
					method: 'GET',
					path: '/user'
				},
				response: {
					data: 'pass'
				}
			},
			{
				request: {
					method: 'GET',
					path: '/user',
					params: {
						id: 1
					}
				},
				response: {
					data: {
						name: 'Carlos Github'
					}
				}
			},
			{
				request: {
					method: 'post',
					path: '/user'
				},
				response: {
					status: 200,
					data: 'Generic match'
				}
			},
			{
				request: {
					method: 'post',
					path: '/user',
					data: {
						name: 'Carlos'
					}
				},
				response: {
					data: 'Carlos has been saved'
				}
			},
			{
				request: {
					method: 'post',
					path: '/user',
					data: {
						name: 'Other name'
					}
				},
				response: {
					status: 500,
					data: {
						error: 'Cant save other users'
					}
				}
			}
		]);

		mock();
	}

	configureMock();

	angular.module('httpMock').run(function($http){
		http = $http;
	});

	describe('direct calls', function(){
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
});