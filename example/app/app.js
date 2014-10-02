angular
	.module('example', [])
	.factory('userService', function($http){
		return {
			get: function(){
				return $http({ method: 'GET', url: '/users' });
			}
		}
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
				self.error = response;
			});
	});