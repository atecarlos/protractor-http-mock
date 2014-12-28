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
				return $http.post('/convs/new')
			},
			delete: function(id){
				return $http.delete('/convs/' + id)
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

		self.save = function(){
			userService.post({ name: self.newUser })
				.then(function(){
					self.success = 'new user saved: ' + self.newUser;
					self.newUser = '';
				})
				.catch(function(response){
					self.showError = true;
					self.error = response.data.error;
				});
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

		function handler(data, status, headers, config){
			self.data = data;
			self.status = status;
			self.headers = headers;
			self.config = config;
		}

		convenienceService.get()
			.success(handler)
			.error(function(data, status, headers, config){
				self.showError = true;
				handler.call(self, arguments);
			});

		self.save = function(){
			convenienceService.post({ type: self.newConv })
				.success(handler)
				.error(function(data, status, headers, config){
					self.showError = true;
					handler.call(self, arguments);
				});
		};

		self.delete = function(){
			convenienceService.delete(self.idToRemove)
				.success(handler)
				.error(function(data, status, headers, config){
					self.showError = true;
					handler.call(self, arguments);
				});
		};
	});