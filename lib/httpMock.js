'use strict';

var queryString = require('query-string');

function mockTemplate() {
    var queryStringParse = '<place_query_string_parse_here>';
    var expectations = '<place_content_here>';
    var plugins = '<place_plugins_here>';

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

        function transformData(data, headers, status, fns) {
            if (typeof fns === 'function') {
                data = fns(data, headers, status);
            } else {
                for (var i = 0; i < fns.length; i++) {
                    data = fns[i](data, headers, status);
                }
            }

            return data;
        }

        function transformRequest(requestConfig){
            if (requestConfig.transformRequest) {
                requestConfig.data = transformData(requestConfig.data,
                                              requestConfig.headers,
                                              undefined,
                                              requestConfig.transformRequest);
            }

            return requestConfig;
        }

        function getTransformedAndInterceptedRequestConfig(requestConfig) {
            for (var i = 0; i < interceptors.length; i++) {
                var interceptor = getInterceptor(interceptors[i]);

                if (interceptor.request) {
                    $q.when(interceptor.request(requestConfig)).then(function(interceptedRequestConfig){
                        requestConfig = interceptedRequestConfig;
                    });
                }
            }

            requestConfig = transformRequest(requestConfig);

            return requestConfig;
        }

        function transformResponse(response) {
            if (response.config.transformResponse) {
                response.data = transformData(response.data,
                                              response.headers,
                                              response.status,
                                              response.config.transformResponse);
            }

            return response;
        }

        function getTransformedAndInterceptedResponse(response) {
            response = transformResponse(response);

            // Response interceptors are invoked in reverse order as per docs
            for (var i = interceptors.length - 1; i >= 0; i--) {
                var interceptor = getInterceptor(interceptors[i]);

                if (interceptor.response) {
                    $q.when(interceptor.response(response)).then(function(interceptedResponse){
                        response = interceptedResponse;
                    });
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

        function matchProperty(property, expectationRequest, config){
            return !expectationRequest[property] || angular.equals(expectationRequest[property], config[property]);
        }

        function matchParams(expectationRequest, config){
            return matchProperty('params', expectationRequest, config);
        }

        function matchData(expectationRequest, config){
            return matchProperty('data', expectationRequest, config);
        }

        function matchHeaders(expectationRequest, config){
            var simplifiedConfig = angular.copy(config);

            if(simplifiedConfig.headers){
                var headers = simplifiedConfig.headers;

                for(var prop in headers){
                    if(headers.hasOwnProperty(prop) && typeof headers[prop] === 'function'){
                        headers[prop] = headers[prop](config);

                        if(headers[prop] === null){
                            delete headers[prop];
                        }
                    }
                }
            }

            return matchProperty('headers', expectationRequest, simplifiedConfig);
        }

        function matchQueryString(expectationRequest, config){
            var match = true,
                url = config.url;

            var queryStringStartIndex = url.indexOf('?');

            if(expectationRequest.queryString && queryStringStartIndex > -1){
                var qsParams = queryStringParse(url.substring(queryStringStartIndex, url.length));
                match = angular.equals(expectationRequest.queryString, qsParams);
            }

            return match;
        }

        function matchMethod(expectationRequest, config){
            var configMethod = config.method ? config.method.toLowerCase() : 'get';
            return expectationRequest.method.toLowerCase() === configMethod;
        }

        function matchByPlugins(expectationRequest, config){
            var match = true;
            
            if(plugins.length > 0){
                match = plugins.reduce(function(value, plugin){
                    return plugin(expectationRequest, config) && value;
                }, true);
            }

            return match;
        }

        function match(config, expectationRequest){
            return  matchMethod(expectationRequest, config) &&
                    endsWith(config.url, expectationRequest.path) &&
                    matchParams(expectationRequest, config) &&
                    matchData(expectationRequest, config) &&
                    matchQueryString(expectationRequest, config) &&
                    matchHeaders(expectationRequest, config) &&
                    matchByPlugins(expectationRequest, config);
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

        function createHeaderGetterFunction(responseHeaders){
            return function(headerName) {
                if (!headerName) {
                    return responseHeaders;
                }

                return responseHeaders[headerName];
            }
        }

        function httpMock(config){
            var prom;
            var transformedConfig = getTransformedAndInterceptedRequestConfig(angular.copy(config));

            return wrapWithSuccessError($q.when(transformedConfig).then(function(resolvedConfig) {
                var expectation = matchExpectation(resolvedConfig);

                if(expectation){
                    var deferred = $q.defer();

                    newModule.requests.push(resolvedConfig);

                    var delay = expectation.response.delay || 0;

                    setTimeout(function(){
                        var resolvedResponse;

                        expectation.response = expectation.response || {};

                        // Important to clone the response so that interceptors don't change the expectation response
                        resolvedResponse = angular.copy(expectation.response);

                        resolvedResponse.config = resolvedConfig;

                        if(resolvedResponse.headers){
                            resolvedResponse.headers = createHeaderGetterFunction(resolvedResponse.headers);
                        }else{
                            resolvedResponse.headers = function () {};
                        }

                        resolvedResponse = getTransformedAndInterceptedResponse(resolvedResponse);

                        $q.when(resolvedResponse).then(function(resolvedResponse) {
                            resolvedResponse.status = resolvedResponse.status || 200;

                            if (statusIsSuccessful(resolvedResponse.status)) {
                                deferred.resolve(resolvedResponse);
                            } else {
                                deferred.reject(resolvedResponse);
                            }
                        });
                    }, delay);

                    prom = deferred.promise;
                } else {
                    prom = $http(config);
                }

                return prom;
            }));
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

    newModule.addMocks = function(expectationsToAdd){
        expectations = expectations.concat(expectationsToAdd);
    };

    newModule.removeMocks = function(expectationsToRemove){
        expectations.forEach(function(expectation, index) {
            expectationsToRemove.forEach(function(expectationToRemove) {
                if (angular.equals(expectationToRemove, expectation)) {
                    expectations.splice(index, 1);
                }
            });
        });
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

function getPluginsString(plugins){
    if(plugins){
        var pluginStrings = [];

        plugins.forEach(function(plugin){
            pluginStrings.push(plugin.match.toString());
        });

       return pluginStrings.join();
    } else{
        return '';
    }
}

module.exports = function(expectations, plugins){
    var templateString = mockTemplate.toString();
    var template = templateString.substring(templateString.indexOf('{') + 1, templateString.lastIndexOf('}'));
    var pluginsString = getPluginsString(plugins);

    var newFunc = 
        template
            .replace(/'<place_content_here>'/, '[' + getExpectationsString(expectations) + ']')
            .replace(/'<place_query_string_parse_here>'/, queryString.parse.toString())
            .replace(/'<place_plugins_here>'/, '[' + pluginsString + ']');

    /*jslint evil: true */
    return new Function(newFunc);
};
