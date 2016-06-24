describe('interceptors', function(){
	var module = window.__module, http;

	beforeAll(function(){
		http = window.__getHttp();
	});
	
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
				},
				responseError: function(response){
					if(response.config.url.match(/response-error/)){
						response.data.interceptedResponseError = true;
					}

					return $q.reject(response);
				}
			}
		}]);

		$httpProvider.interceptors.push(['$q', function($q){
			return {
				request: function(config){
					if(config.url.match(/with-headers/)){
						config.headers['authorization'] = 'token';
					}

					return config;
				},
				response: function(response){
					if(response.config.url.match(/with-headers/)){
						response.headers['response-header'] = 'response-header';

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

	it('allows for intercepts handling an error response', function(done){
		http({
			method: 'GET',
			url: 'test-url.com/response-error'
		}).catch(function(response){
			expect(response.data.interceptedResponseError).toBe(true);
			expect(response.data.name).toBe('intercept test');
			done();
		});
	});

	it('provides default empty object headers if none are set', function(done){
		http({
			method: 'GET',
			url: 'test-url.com/with-headers'
		}).then(function(response){
			expect(response.headers['response-header']).toBe('response-header');
			done();
		});
	});
});