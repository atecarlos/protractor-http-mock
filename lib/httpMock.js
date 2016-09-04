'use strict';

var queryString = require('query-string');
var debug = require('debug')('protractor-http-mock:http-mock');

function mockTemplate() {
    var _debug = window.debug('protractor-http-mock:http-mock:mock-template');

    _debug('start');

    var queryStringParse = '<place_query_string_parse_here>';
    var expectations = '<place_content_here>';
    var plugins = '<place_plugins_here>';

    var newModule = angular.module('httpMock', []);

    newModule.requests = [];

    newModule.config(['$provide', '$httpProvider', function($provide, $httpProvider){
        var _debug = window.debug('protractor-http-mock:http-mock:mock-template:config');

        _debug('start');

        $provide.decorator('$http', ['$delegate', '$q', '$injector', function($http, $q, $injector) {
        var _debug = window.debug('protractor-http-mock:http-mock:mock-template:config:decorator');

        _debug('start');

        var interceptors = $httpProvider.interceptors;

        function getInterceptor(interceptorExpression) {
            _debug('get-interceptor');

            if (angular.isString(interceptorExpression)) {
                return $injector.get(interceptorExpression);
            } else {
                return $injector.invoke(interceptorExpression);
            }
        }

        function transformData(data, headers, status, fns) {
            _debug('tranform-data');

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
            _debug('transform-request');

            if (requestConfig.transformRequest) {
                requestConfig.data = transformData(requestConfig.data,
                                              requestConfig.headers,
                                              undefined,
                                              requestConfig.transformRequest);
            }

            return requestConfig;
        }

        function getTransformedAndInterceptedRequestConfig(requestConfig) {
            _debug('get-transformed-and-intercepted-request-config');

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
            _debug('transform-response');

            if (response.config.transformResponse) {
                response.data = transformData(response.data,
                                              response.headers,
                                              response.status,
                                              response.config.transformResponse);
            }

            return response;
        }

        function statusIsSuccessful(status){
            _debug('status-is-successful');

            return status >= 200 && status <= 299;
        }

        function getTransformedAndInterceptedResponse(response) {
            _debug('get-transformed-and-intercepted-response');

            response = transformResponse(response);

            // Response interceptors are invoked in reverse order as per docs
            for (var i = interceptors.length - 1; i >= 0; i--) {
                var interceptor = getInterceptor(interceptors[i]);

                if (interceptor.response && statusIsSuccessful(response.status)) {
                    $q.when(interceptor.response(response)).then(function(interceptedResponse){
                        response = interceptedResponse;
                    });
                }

                if (interceptor.responseError && !statusIsSuccessful(response.status)) {
                    $q.reject(interceptor.responseError(response)).then(null, function(interceptedResponse){
                        response = interceptedResponse;
                    });
                }
            }

            return response;
        }

        function matchRegex(pattern, string){
            _debug('match-regex');

            var regex = new RegExp(pattern);
            return regex.test(string);
        }

        function endsWith(url, path){
            _debug('ends-with');

            var questionMarkIndex = url.indexOf('?');

            if(questionMarkIndex < 0){
                return url.indexOf(path, url.length - path.length) !== -1;
            }else{
                var noQueryStringUrl = url.substring(0, questionMarkIndex);
                return endsWith(noQueryStringUrl, path);
            }
        }

        function matchProperty(property, expectationRequest, config){
            _debug('match-property');

            return !expectationRequest[property] || angular.equals(expectationRequest[property], config[property]);
        }

        function matchParams(expectationRequest, config){
            _debug('match-params');

            return matchProperty('params', expectationRequest, config);
        }

        function matchData(expectationRequest, config){
            _debug('match-data');

            return matchProperty('data', expectationRequest, config);
        }

        function matchHeaders(expectationRequest, config){
            _debug('match-headers');

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
            _debug('match-query-string');

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
            _debug('match-method');

            var configMethod = config.method ? config.method.toLowerCase() : 'get';
            return expectationRequest.method.toLowerCase() === configMethod;
        }

        function matchByPlugins(expectationRequest, config){
            _debug('match-by-plugins');

            var match = true;

            if(plugins.length > 0){
                match = plugins.reduce(function(value, plugin){
                    return plugin(expectationRequest, config) && value;
                }, true);
            }

            return match;
        }

        function match(config, expectationRequest){
            _debug('match');

            return  matchMethod(expectationRequest, config) &&
                    (expectationRequest.regex ? matchRegex(expectationRequest.path, config.url)
                                              : endsWith(config.url, expectationRequest.path)) &&
                    matchParams(expectationRequest, config) &&
                    matchData(expectationRequest, config) &&
                    matchQueryString(expectationRequest, config) &&
                    matchHeaders(expectationRequest, config) &&
                    matchByPlugins(expectationRequest, config);
        }

        function matchExpectation(config){
            var _debug = window.debug('protractor-http-mock:http-mock:mock-template:config:decorator:matchExpectation');

            var expectation;

            for(var i = 0; i < expectations.length; i++){
                if(match(config, expectations[i].request)){
                    expectation = expectations[i];
                }
            }

            if (!expectation) {
              _debug(`expectation doesnt match config (${config.method} ${config.url})`);
            }

            return expectation;
        }

        function wrapWithSuccessError(promise) {
            _debug('wrap-with-success-error');

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

        function createHeaderGetterFunction(responseHeaders){
            _debug('create-header-getter-function');

            return function(headerName) {
                if (!headerName) {
                    return responseHeaders;
                }

                return responseHeaders[headerName];
            };
        }

        function addToRequestHistory(config){
            _debug('add-to-request-history');

            var copy = angular.copy(config);

            // This is done to maintain backwards compatability
            // as well as providing a cleaner request history
            if(angular.equals(copy.headers, {})){
                delete copy.headers;
            }

            newModule.requests.push(copy);
        }

        function httpMock(config){
            _debug('http-mock');

            var prom;

            config.headers = config.headers || {};
            var transformedConfig = getTransformedAndInterceptedRequestConfig(angular.copy(config));

            return wrapWithSuccessError($q.when(transformedConfig).then(function(resolvedConfig) {
                var expectation = matchExpectation(resolvedConfig);

                if(expectation){
                    var deferred = $q.defer();

                    addToRequestHistory(resolvedConfig);

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

                        resolvedResponse.status = resolvedResponse.status || 200;
                        resolvedResponse = getTransformedAndInterceptedResponse(resolvedResponse);

                        $q.when(resolvedResponse).then(function(resolvedResponse) {
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
            _debug('httpMock.get');

            config = config || {};
            config.url = url;
            config.method = 'GET';

            return httpMock(config);
        };

        httpMock.delete = function(url, config){
            _debug('httpMock.delete');

            config = config || {};
            config.url = url;
            config.method = 'DELETE';

            return httpMock(config);
        };

        httpMock.head = function(url, config){
            _debug('httpMock.head');

            config = config || {};
            config.url = url;
            config.method = 'HEAD';

            return httpMock(config);
        };

        httpMock.jsonp = function(url, config){
            _debug('httpMock.jsonp');

            config = config || {};
            config.url = url;
            config.method = 'JSONP';

            return httpMock(config);
        };

        httpMock.post = function(url, data, config){
            _debug('httpMock.post');

            config = config || {};
            config.url = url;
            config.data = data;
            config.method = 'POST';

            return httpMock(config);
        };

        httpMock.put = function(url, data, config){
            _debug('httpMock.put');

            config = config || {};
            config.url = url;
            config.data = data;
            config.method = 'PUT';

            return httpMock(config);
        };

        httpMock.patch = function(url, data, config){
            _debug('httpMock.patch');

            config = config || {};
            config.url = url;
            config.data = data;
            config.method = 'PATCH';

            return httpMock(config);
        };

        httpMock.defaults = $http.defaults;

        _debug('end');

        return httpMock;
      }]);

      _debug('end');
    }]);

    newModule.clearRequests = function(){
        _debug('clear-requests');

        newModule.requests = [];
    };

    newModule.addMocks = function(expectationsToAdd){
        _debug('add-mocks');

        expectations = expectations.concat(expectationsToAdd);
    };

    newModule.removeMocks = function(expectationsToRemove){
        _debug('remove-mocks');

        expectations.forEach(function(expectation, index) {
            expectationsToRemove.forEach(function(expectationToRemove) {
                if (angular.equals(expectationToRemove, expectation)) {
                    expectations.splice(index, 1);
                }
            });
        });
    };

    _debug('end');

    return newModule;
}

function getExpectationsString(expectations){
    debug('get expectations string');

    var printExpectations = [];

    for(var i=0; i< expectations.length; i++){
        printExpectations.push(JSON.stringify(expectations[i]));
    }

    return printExpectations.toString();
}

function getPluginsString(plugins){
    debug('get plugins string');

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
    debug('start');

    var templateString = mockTemplate.toString();
    var template = templateString.substring(templateString.indexOf('{') + 1, templateString.lastIndexOf('}'));
    var pluginsString = getPluginsString(plugins);

    var newFunc =
        template
            .replace(/'<place_content_here>'/, '[' + getExpectationsString(expectations) + ']')
            .replace(/'<place_query_string_parse_here>'/, queryString.parse.toString())
            .replace(/'<place_plugins_here>'/, '[' + pluginsString + ']');

    debug('end');

    /*jslint evil: true */
    return new Function(newFunc);
};
