describe('runtime mocks', function(){
	var module = window.__module, http;

	beforeAll(function(){
		http = window.__getHttp();
	});
	
	var runtimeMocks = [
		{
			request: {
				method: 'GET',
				path: '/runtime'
			},
			response: {
				data: 'runtime'
			}
		},
		{
			request: {
				method: 'GET',
				path: '/runtime'
			},
			response: {
				data: 'override'
			}
		}
	];

	afterEach(function(){
		module.removeMocks(runtimeMocks);
	});

	it('adds runtime mocks', function(done){
		module.addMocks(runtimeMocks);

		http({
			method: 'GET',
			url: '/runtime'
		}).then(function(response){
			expect(response.data).toBe('override');
			done();
		});
	});

	it('can remove runtime mocks', function(done){
		module.addMocks(runtimeMocks);
		module.removeMocks([{
			request: {
				method: 'GET',
				path: '/runtime'
			},
			response: {
				data: 'override'
			}
		}]);

		http({
			method: 'GET',
			url: '/runtime'
		}).then(function(response){
			expect(response.data).toBe('runtime');
			done();
		});
	});
});