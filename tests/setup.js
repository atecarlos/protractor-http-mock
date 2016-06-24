(function(context){
	var expectations = [
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
				path: '/response-error',
				interceptedRequest: true,
				method: 'get'
			},
			response: {
				data: {
					name: 'intercept test'
				},
				status: 400
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
		},
		{
			request: {
				path: '/plugin',
				method: 'get',
				plugin: {
					check: true
				}
			},
			response: {
				data: 'plugin match works!'
			}
		},
		{
			request: {
				path: 'regex\\/.*',
				regex: true,
				method: 'get',
			},
			response: {
				data: 'regex any match'
			}
		},
		{
			request: {
				path: '\\/regex\\/[0-9]',
				regex: true,
				method: 'get',
			},
			response: {
				data: 'regex number match'
			}
		}
	];

	var plugins = [
		{
			match: function(mockRequest, requestConfig){
				var match = true;

				if(requestConfig.plugin  && mockRequest.plugin){
					return mockRequest.plugin.check;
				}

				return match;
			}
		}
	];

	context.httpMock(expectations, plugins)();

	context.__module = angular.module('httpMock').run(function($http){
		context.__getHttp = function(){
			return $http;
		};
	});
})(window);