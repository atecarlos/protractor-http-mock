(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.httpMock = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var queryString = require('query-string');

function mockTemplate() {
	var queryStringParse = '<place_query_string_parse_here>';
	var expectations = '<place_content_here>';

	var newModule = angular.module('httpMock', []);

	newModule.requests = [];

	newModule.config(['$provide', function($provide){
		$provide.decorator('$http', ['$delegate', '$q', function($http, $q) {
			function endsWith(url, path){
				var questionMarkIndex = url.indexOf('?');

				if(questionMarkIndex < 0){
					return url.indexOf(path, url.length - path.length) !== -1;
				}else{
					var noQueryStringUrl = url.substring(0, questionMarkIndex);
					return endsWith(noQueryStringUrl, path);
				}
			}

			function matchParams(expectationRequest, config){
				return !expectationRequest.params || angular.equals(expectationRequest.params, config.params);
			}

			function matchData(expectationRequest, config){
				return !expectationRequest.data || angular.equals(expectationRequest.data, config.data);
			}

			function matchQueryString(expectationParams, url){
				var match = true;

				var queryStringStartIndex = url.indexOf('?');

				if(queryStringStartIndex > -1){
					var configParams = queryStringParse(url.substring(queryStringStartIndex, url.length));
					match = angular.equals(expectationParams, configParams);
				}

				return match;
			}

			function match(config, expectationRequest){
				return	expectationRequest.method.toLowerCase() === config.method.toLowerCase() &&
						endsWith(config.url, expectationRequest.path) &&
						matchParams(expectationRequest, config) &&
						matchData(expectationRequest, config) &&
						matchQueryString(expectationRequest.queryString, config.url);
			}

			function matchExpectation(config){
				var expectation;

				for(var i = 0; i < expectations.length; i++){
					if(match(config, expectations[i].request)){
						expectation = expectations[i];
					}
				}

				return expectation;
			}
			
			function wrapWithSuccessError(promise) {
				var myPromise = promise;
				
				myPromise.success = function(callback) {
					myPromise.then(function(response) {
						callback(response.data, response.status, response.headers, response.config);
					});
					return myPromise;
				};

				myPromise.error = function(callback) {
					myPromise.then(null, function(response) {
						callback(response.data, response.status, response.headers, response.config);
					});
					return myPromise;
				};

				return myPromise;
			}

			function statusIsSuccessful(status){
				return status >= 200 && status <= 299;
			}

			function httpMock(config){
				var prom;
				var expectation = matchExpectation(config);

				if(expectation){
					var deferred = $q.defer();

					newModule.requests.push(config);

					setTimeout(function(){
						expectation.response = expectation.response || {};
						
						var response = {
							data: expectation.response.data || {},
							config: config,
							headers: function(){}
						};

						response.status = expectation.response.status || 200;

						if(statusIsSuccessful(response.status)){
							deferred.resolve(response);
						}else{
							deferred.reject(response);
						}

					}, 0);

					prom = wrapWithSuccessError(deferred.promise);
				}else{
					prom = $http(config);
				}

				return prom;
			}

			httpMock.get = function(url, config){
				config = config || {};
				config.url = url;
				config.method = 'GET';

				return httpMock(config);
			};

			httpMock.delete = function(url, config){
				config = config || {};
				config.url = url;
				config.method = 'DELETE';

				return httpMock(config);
			};

			httpMock.head = function(url, config){
				config = config || {};
				config.url = url;
				config.method = 'HEAD';

				return httpMock(config);
			};

			httpMock.jsonp = function(url, config){
				config = config || {};
				config.url = url;
				config.method = 'JSONP';

				return httpMock(config);
			};

			httpMock.post = function(url, data, config){
				config = config || {};
				config.url = url;
				config.data = data;
				config.method = 'POST';

				return httpMock(config);
			};

			httpMock.put = function(url, data, config){
				config = config || {};
				config.url = url;
				config.data = data;
				config.method = 'PUT';

				return httpMock(config);
			};

			httpMock.patch = function(url, data, config){
				config = config || {};
				config.url = url;
				config.data = data;
				config.method = 'PATCH';

				return httpMock(config);
			};

			httpMock.defaults = $http.defaults;
			
			return httpMock;
		}]);
	}]);
	
	newModule.clearRequests = function(){
		newModule.requests = [];
	};

	return newModule;
}

function getExpectationsString(expectations){
	var printExpectations = [];

	for(var i=0; i< expectations.length; i++){
		printExpectations.push(JSON.stringify(expectations[i]));
	}

	return printExpectations.toString();
}

module.exports = function(expectations){
	var templateString = mockTemplate.toString();
	var template = templateString.substring(templateString.indexOf('{') + 1, templateString.lastIndexOf('}'));
	var newFunc = template.replace(/'<place_content_here>'/, '[' + getExpectationsString(expectations) + ']');
	newFunc = newFunc.replace(/'<place_query_string_parse_here>'/, queryString.parse.toString());

	/*jslint evil: true */
	return new Function(newFunc);
};

},{"query-string":2}],2:[function(require,module,exports){
/*!
	query-string
	Parse and stringify URL query strings
	https://github.com/sindresorhus/query-string
	by Sindre Sorhus
	MIT License
*/
(function () {
	'use strict';
	var queryString = {};

	queryString.parse = function (str) {
		if (typeof str !== 'string') {
			return {};
		}

		str = str.trim().replace(/^(\?|#)/, '');

		if (!str) {
			return {};
		}

		return str.trim().split('&').reduce(function (ret, param) {
			var parts = param.replace(/\+/g, ' ').split('=');
			var key = parts[0];
			var val = parts[1];

			key = decodeURIComponent(key);
			// missing `=` should be `null`:
			// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
			val = val === undefined ? null : decodeURIComponent(val);

			if (!ret.hasOwnProperty(key)) {
				ret[key] = val;
			} else if (Array.isArray(ret[key])) {
				ret[key].push(val);
			} else {
				ret[key] = [ret[key], val];
			}

			return ret;
		}, {});
	};

	queryString.stringify = function (obj) {
		return obj ? Object.keys(obj).map(function (key) {
			var val = obj[key];

			if (Array.isArray(val)) {
				return val.map(function (val2) {
					return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
				}).join('&');
			}

			return encodeURIComponent(key) + '=' + encodeURIComponent(val);
		}).join('&') : '';
	};

	if (typeof define === 'function' && define.amd) {
		define(function() { return queryString; });
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = queryString;
	} else {
		window.queryString = queryString;
	}
})();

},{}]},{},[1])(1)
});