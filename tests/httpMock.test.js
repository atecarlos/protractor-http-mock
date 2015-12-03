describe('http mock', function(){
	var http = null,
		module;

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
					headers: {
						'x-auth': 'pass',
						'gzip-pro': 'yes'
					}
				},
				response: {
					data: 'authentication passed'
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
					method: 'GET',
					path: '/user/search'
				},
				response: {
					data: {
						name: 'Whatever you search'
					}
				}
			},
			{
				request: {
					method: 'GET',
					path: '/user/search',
					queryString: {
						id: '1',
						city: 'ny&ny'
					}
				},
				response: {
					data: {
						name: 'Carlos QS'
					}
				}
			},
			{
				request: {
					method: 'GET',
					path: '/with-headers'
				},
				response: {
					data: 'read my headers',
					headers: {
						'X-AUTH': 'authenticated',
						'ANGULAR_API': 'ang=api'
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
			},
			{
				request: {
					path: '/head',
					method: 'head'
				},
				response: {
					data: 'head response'
				}
			},
			{
				request: {
					path: '/delete',
					method: 'delete'
				},
				response: {
					data: 'delete response'
				}
			},
			{
				request: {
					path: '/put',
					method: 'put'
				},
				response: {
					data: 'put response'
				}
			},
			{
				request: {
					path: '/patch',
					method: 'patch'
				},
				response: {
					data: 'patch response'
				}
			},
			{
				request: {
					path: '/jsonp',
					method: 'jsonp'
				},
				response: {
					data: 'jsonp response'
				}
			},
			{
				request: {
					path: '/intercept',
					interceptedRequest: true,
					method: 'get'
				},
				response: {
					data: {
						name: 'intercept test'
					}
				}
			},
			{
				request: {
					path: '/anonymous-intercept',
					interceptedAnonymousRequest: true,
					method: 'get'
				},
				response: {
					data: {
						name: 'anonymous intercept test'
					}
				}
			},
			{
				request: {
					path: '/promise-request',
					method: 'POST'
				},
				response: {
					data: {
						name: 'promise intercept request test'
					}
				}
			},
			{
				request: {
					path: '/promise-response',
					method: 'post'
				},
				response: {
					data: {
						name: 'promise intercept response test'
					}
				}
			},
			{
				request: {
					path: '/transform-request',
					method: 'post',
					data: {
						name: 'test',
						city: 'test city'
					}
				},
				response: {
					data: {
						name: 'multiple transforms request test'
					}
				}
			},
			{
				request: {
					path: '/transform-request',
					method: 'post',
					data: {
						name: 'test'
					}
				},
				response: {
					data: {
						name: 'transform request test'
					}
				}
			},
			{
				request: {
					path: '/transform-response',
					method: 'get'
				},
				response: {
					data: {
						name: 'test'
					}
				}
			}
		]);

		mock();
	}

	configureMock();

	module = angular.module('httpMock').run(function($http){
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

	describe('convenience methods', function(){
		it('get', function(done){
			http.get('test-api.com/user').then(function(response){
				expect(response.data).toBe('pass');
				done();
			});
		});

		it('post', function(done){
			http.post('/user', {
				name: 'Carlos'
			}).then(function(response){
				expect(response.data).toBe('Carlos has been saved');
				done();
			});
		});

		it('head', function(done){
			http.head('/head').then(function(response){
				expect(response.data).toBe('head response');
				done();
			});
		});

		it('put', function(done){
			http.put('/put').then(function(response){
				expect(response.data).toBe('put response');
				done();
			});
		});

		it('delete', function(done){
			http.delete('/delete').then(function(response){
				expect(response.data).toBe('delete response');
				done();
			});
		});

		it('jsonp', function(done){
			http.jsonp('/jsonp').then(function(response){
				expect(response.data).toBe('jsonp response');
				done();
			});
		});
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

	describe('query string', function(){
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

	describe('$http promises', function(){
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

	describe('interceptors', function(){
		module.config(['$provide', '$httpProvider', function($provide, $httpProvider){

			$provide.factory('testInterceptor', function($q) {
				return {
					request: function(config){
						if(config.url.match(/promise-request/)){
							return $q.when(config);
						}

						return config;
					},

					response: function(response){
						var responseReturn;

						if(response.config.url.match(/intercept/)){
							response.data.interceptedResponse = true;
						}

						return response;
					}
				}
			});

			$httpProvider.interceptors.push('testInterceptor');

			$httpProvider.interceptors.push(function(){
				return {
					request: function(config){
						if(config.url.match(/anonymous-intercept/)){
							config.interceptedAnonymousRequest = true;
						}

						return config;
					}
				}
			});

			$httpProvider.interceptors.push(['$q', function($q){
				return {
					request: function(config){
						if(config.url.match(/intercept/)){
							config.interceptedRequest = true;
						}

						return config;
					},
					response: function(response){
						if(response.config.url.match(/promise-response/)){
							response.data.interceptedPromiseResponse = true;

							return $q.when(response);
						}

						return response;
					}
				}
			}]);
		}]);

		it('allows intercepts through service factory functions', function(done){
			http({
				method: 'GET',
				url: 'test-url.com/intercept'
			}).then(function(response){
				expect(response.data.interceptedResponse).toBe(true);
				expect(response.data.name).toBe('intercept test');
				done();
			});
		});

		it('allows for intercepts through anonymous factory', function(done){
			http({
				method: 'GET',
				url: 'test-url.com/anonymous-intercept'
			}).then(function(response){
				expect(response.data.name).toBe('anonymous intercept test');
				expect(response.data.interceptedResponse).toBeTruthy();
				done();
			});
		});

		it('allows for intercepts that return a promise from a request', function(done){
			http({
				method: 'POST',
				url: 'test-url.com/promise-request'
			}).then(function(response){
				expect(response.data.name).toBe('promise intercept request test');
				done();
			});
		});

		it('allows for intercepts that return a promise from a response', function(done){
			http({
				method: 'POST',
				url: 'test-url.com/promise-response'
			}).then(function(response){
				expect(response.data.name).toBe('promise intercept response test');
				expect(response.data.interceptedPromiseResponse).toBeTruthy();
				done();
			});
		});
	});

	describe('headers', function(){
		it('matches a request by headers', function(done){
			http({
				method: 'get',
				url: 'my-api.com/user',
				headers: {
					'x-auth': 'pass',
					'gzip-pro': 'yes'
				}
			}).then(function(response){
				expect(response.data).toBe('authentication passed');
				done();
			});
		});

		it('can respond with headers', function(done){
			http({
				url: 'my-api.com/with-headers',
				method: 'get'
			}).then(function(response){
				expect(response.headers('X-AUTH')).toBe('authenticated');
				expect(response.headers('ANGULAR_API')).toBe('ang=api');
				done();
			});
		});

		it('can respond with headers in convenience methods', function(done){
			http({
				url: 'my-api.com/with-headers',
				method: 'get'
			}).success(function(data, status, headers){
				expect(headers('X-AUTH')).toBe('authenticated');
				expect(headers('ANGULAR_API')).toBe('ang=api');
				done();
			});
		});

		it('ignores header properties when their function return value is null', function(done){
			http({
				method: 'get',
				url: 'my-api.com/user',
				headers: {
					'x-auth': 'pass',
					'gzip-pro': 'yes',
					'ignore-me': function(){
						return null;
					}
				}
			}).then(function(response){
				expect(response.data).toBe('authentication passed');
				done();
			});
		});

		it('always returns a header', function(done){
			http({
				method: 'GET',
				url: 'test-api.com/user'
			}).then(function(response){
				expect(response.headers).toBeDefined();
				done();
			});
		});

		it('matches request by complex headers (include functions)', function(done){
			http({
				method: 'get',
				url: 'my-api.com/user',
				headers: {
					'x-auth': 'pass',
					'gzip-pro': function(config){
						if(config){
							return 'yes';
						}
					}
				}
			}).then(function(response){
				expect(response.data).toBe('authentication passed');
				done();
			});
		});
	});

	describe('transforms', function(){
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

	describe('external url', function(){
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
});