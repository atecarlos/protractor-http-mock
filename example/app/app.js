angular
	.module('example', [])
	.factory('defaultService', function($http){
		return {
			get: function(){
				return $http({ method: 'GET', url: '/default' });
			}
		};
	})
	.factory('userService', function($http){
		return {
			get: function(){
				return $http({ method: 'GET', url: '/users' });
			},
			post: function(data){
				return $http({ method: 'POST', url: '/users/new', data: data });
			},
			getBy: function(name, city){
				return $http({
					method: 'GET',
					url: '/users',
					params: {
						name: name,
						city: city
					}
				});
			},
			getById: function(id){
				console.log(id);
				return $http({
					method: 'GET',
					url: '/users/' + id
				});
			},
			getByQuery: function(name, city){
				return $http({
					method: 'GET',
					url: '/users?name=' + encodeURIComponent(name) + '&city=' + encodeURIComponent(city)
				});
			},
			getAuthenticated: function(auth){
				return $http({
					method: 'GET',
					url: '/users',
					headers: {
						auth: auth
					}
				});
			},
			getFromExternalBy: function(name, city){
				return $http({
					method: 'GET',
					url: 'http://some-other.com/users',
					params: {
						name: name,
						city: city
					}
				});
			},
			getThroughPlugin: function(){
				return $http.get('/users', {
					plugin: {}
				});
			}
		};
	})
	.factory('groupService', function($http){
		return {
			get: function(){
				return $http({ method: 'GET', url: '/groups' });
			}
		};
	})
	.factory('convenienceService', function($http){
		return {
			get: function(){
				return $http.get('/convs')
			},
			post: function(data){
				return $http.post('/convs/new', data)
			},
			delete: function(id){
				return $http.delete('/convs/' + id)
			},
			head: function(){
				return $http.head('/convs');
			},
			jsonp: function(){
				return $http.jsonp('/convs');
			},
			patch: function(id, data){
				return $http.patch('/convs/' + id, data);
			},
			put: function(id, data){
				return $http.put('/convs/' + id, data);
			}
		}
	})
	.controller('DefaultController', function(defaultService){
		var self = this;
		self.name = '';

		defaultService.get()
			.then(function(response){
				self.name = response.data.name;
			});
	})
	.controller('UserController', function(userService){
		var self = this;

		self.users = [];
		self.error = null;
		self.success = null;
		self.showError = false;
		self.foundUser = null;
		self.authenticated = false;

		userService.get()
			.then(function(response){
				self.users = response.data;
			})
			.catch(function(response){
				self.showError = true;
				self.error = response.data.error;
			});

		function thenHandler(){
			self.success = 'new user saved: ' + self.newUser;
			self.newUser = '';

			self.showError = false;
			self.error = null;
		}

		function catchHandler(response){
			self.showError = true;
			self.error = response.data.error;

			self.success = null;
			self.newUser = null;
		}

		self.save = function(){
			userService.post({ name: self.newUser })
				.then(thenHandler)
				.catch(catchHandler);
		};

		self.saveName = function(){
			userService.post(self.newUser)
				.then(thenHandler)
				.catch(catchHandler);
		};

		self.addDefaultUsers = function(){
			userService.post({
				group: self.newUser,
				users: [
					{ name: 'One' },
					{ name: 'Two' }
				]
			}).then(thenHandler).catch(catchHandler);
		};

		function searchHandler(response){
			self.foundUser = response.data.name;
			self.success = 'User found: ' + self.query;
			self.showError = false;
			self.error = null;
		}

		self.search = function(){
			userService.getBy(self.query, self.queryCity || undefined)
				.then(searchHandler)
				.catch(catchHandler);
		};

		self.searchById = function() {
			userService.getById(self.query)
				.then(searchHandler)
				.catch(catchHandler);
		};

		self.searchByQuery = function(){
			userService.getByQuery(self.query, self.queryCity)
				.then(searchHandler)
				.catch(catchHandler);
		};

		self.searchExternal = function(){
			userService.getFromExternalBy(self.query, self.queryCity)
				.then(searchHandler)
				.catch(catchHandler);
		};

		self.getAuthenticated = function(){
			userService.getAuthenticated(self.authenticated)
				.then(function(response){
					self.users = response.data;
				})
				.catch(catchHandler);
		};
	})
	.controller('GroupController', function(groupService){
		var self = this;

		self.groups = [];

		groupService.get()
			.then(function(response){
				self.groups = response.data;
			});
	})
	.controller('ConvenienceController', function(convenienceService){
		var self = this;

		self.convs = [];
		self.showError = false;

		function handler(data, status){
			self.data = data;
			self.status = status;
		}

		function successHandler(data, status){
			self.showError = false;
			handler(data, status);
		}

		function errorHandler(data, status){
			self.showError = true;
			handler(data, status);
		}

		convenienceService.get()
			.success(successHandler)
			.error(errorHandler);

		self.getMeta = function(){
			convenienceService.head()
				.success(successHandler)
				.error(errorHandler);
		};

		self.save = function(){
			var dataToPost = self.input ? { test: self.input } : undefined;

			convenienceService.post(dataToPost)
				.success(successHandler)
				.error(errorHandler);
		};

		self.delete = function(){
			convenienceService.delete(self.id)
				.success(successHandler)
				.error(errorHandler);
		};

		self.update = function(){
			convenienceService.put(self.id, { test: self.input })
				.success(successHandler)
				.error(errorHandler);
		};

		self.patch = function(){
			convenienceService.patch(self.id, { test: self.input })
				.success(successHandler)
				.error(errorHandler);
		};

		self.jsonp = function(){
			convenienceService.jsonp()
				.success(successHandler)
				.error(errorHandler);
		};
	})
	.controller('HttpDefaultsController', function($http){
		this.hasHttpDefaults = !!$http.defaults;
	})
	.controller('PluginsController', function(userService){
		var self = this;

		self.get = function(){
			return userService.getThroughPlugin().then(function(response){
				console.log('HERE', response);
				self.result = response.data;
			});
		}
	});