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
		self.showError = false;

		userService.get()
			.then(function(response){
				self.users = response.data;
			})
			.catch(function(response){
				self.showError = true;
				self.error = response.data.error;
			});
	})
	.controller('GroupController', function(groupService){
		var self = this;

		self.groups = [];

		groupService.get()
			.then(function(response){
				self.groups = response.data;
			});
	});