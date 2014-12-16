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
	});