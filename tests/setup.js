(function(context){
	function configureMock(){
		var mock = context.httpMock([
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

	context.__module = angular.module('httpMock').run(function($http){
		context.__getHttp = function(){
			return $http;
		};
	});

	// context.__module.config(['$provide', '$httpProvider', function($provide, $httpProvider){
	// 	$provide.factory('testInterceptor', function($q) {
	// 		return {
	// 			request: function(config){
	// 				if(config.url.match(/promise-request/)){
	// 					return $q.when(config);
	// 				}

	// 				return config;
	// 			},

	// 			response: function(response){
	// 				var responseReturn;

	// 				if(response.config.url.match(/intercept/)){
	// 					response.data.interceptedResponse = true;
	// 				}

	// 				return response;
	// 			}
	// 		}
	// 	});

	// 	$httpProvider.interceptors.push('testInterceptor');

	// 	$httpProvider.interceptors.push(function(){
	// 		return {
	// 			request: function(config){
	// 				if(config.url.match(/anonymous-intercept/)){
	// 					config.interceptedAnonymousRequest = true;
	// 				}

	// 				return config;
	// 			}
	// 		}
	// 	});

	// 	$httpProvider.interceptors.push(['$q', function($q){
	// 		return {
	// 			request: function(config){
	// 				if(config.url.match(/intercept/)){
	// 					config.interceptedRequest = true;
	// 				}

	// 				return config;
	// 			},
	// 			response: function(response){
	// 				if(response.config.url.match(/promise-response/)){
	// 					response.data.interceptedPromiseResponse = true;

	// 					return $q.when(response);
	// 				}

	// 				return response;
	// 			}
	// 		}
	// 	}]);
	// }]);
})(window);