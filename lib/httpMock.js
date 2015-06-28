'use strict';

var queryString = require('query-string');

function mockTemplate() {
    var queryStringParse = '<place_query_string_parse_here>';
    var expectations = '<place_content_here>';

    var newModule = angular.module('httpMock', []);

    newModule.requests = [];

    newModule.config(['$provide', '$httpProvider', function($provide, $httpProvider){
        
        $provide.decorator('$http', ['$delegate', '$q', '$injector', function($http, $q, $injector) {

        var interceptors = $httpProvider.interceptors;

        function getInterceptor(interceptorExpression) {
            if (angular.isString(interceptorExpression)) {
                return $injector.get(interceptorExpression);
            } else {
                return $injector.invoke(interceptorExpression);
            }
        }

        function getTransformedRequestConfig(config) {
            for (var i = 0; i < interceptors.length; i++) {
                var interceptor = getInterceptor(interceptors[i]);

                if (interceptor.request) {
                    config = interceptor.request(config);
                }
            }

            return config;
        }

        function getTransformedResponse(response) {
            // Response intreceptors are invoked in reverse order as per docs
            for (var i = interceptors.length - 1; i >= 0; i--) {
                var interceptor = getInterceptor(interceptors[i]);

                if (interceptor.response) {
                    response = interceptor.response(response);
                }
            }

            return response;
        }

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
                var qsParams = queryStringParse(url.substring(queryStringStartIndex, url.length));
                match = angular.equals(expectationParams, qsParams);
            }

            return match;
        }

        function match(config, expectationRequest){
            return  expectationRequest.method.toLowerCase() === config.method.toLowerCase() &&
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
            var transformedConfig = getTransformedRequestConfig(angular.copy(config));
            var expectation = matchExpectation(transformedConfig);

            if(expectation){
                var deferred = $q.defer();

                newModule.requests.push(transformedConfig);

                setTimeout(function(){
                    var resolvedResponse;

                    expectation.response = expectation.response || {};
                    
                    // Important to clone the response so that interceptors don't change the expectation response
                    resolvedResponse = angular.copy(expectation.response);

                    resolvedResponse.config = transformedConfig;
                    resolvedResponse.headers = function () {};
                    resolvedResponse = getTransformedResponse(resolvedResponse);

                    resolvedResponse.status = resolvedResponse.status || 200;

                    if (statusIsSuccessful(resolvedResponse.status)) {
                        deferred.resolve(resolvedResponse);
                    } else {
                        deferred.reject(resolvedResponse);
                    }

                }, 0);
                prom = wrapWithSuccessError(deferred.promise);
            } else {
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
    }]);}]);

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
