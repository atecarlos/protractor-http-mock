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
			convenienceService.post({ test: self.input })
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
	});