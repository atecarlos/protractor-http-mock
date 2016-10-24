# Protractor Mock
A NodeJS module to be used alongside [Protractor](https://github.com/angular/protractor) to facilitate setting up mocks for HTTP calls for the AngularJS applications under test.

This allows the developer to isolate the UI and client-side application code in our tests without any dependencies on an API.

**This plugin does not depend on Angular Mocks (ngMockE2E) being loaded into your app; therefore, there is no need to modify anything within your current Angular web application.**

[![Build Status](https://travis-ci.org/atecarlos/protractor-http-mock.png)](https://travis-ci.org/atecarlos/protractor-http-mock)

## Installation
	npm install protractor-http-mock --save-dev
## Configuration
In your protractor configuration file, we can set the following options:

### Mocks
We can set a collection of default mocks to load for every test, and the name of the folder where your mocks will reside. More on this later.

  	mocks: {
    	default: ['mock-login'], // default value: []
    	dir: 'my-mocks' // default value: 'mocks'
  	},

### Directories and file names
We can also configure our root directory where the mocks and protractor configuration will be located; as well as, the name of the protractor configuration file.

  	onPrepare: function(){
    	require('protractor-http-mock').config = {
			rootDirectory: __dirname, // default value: process.cwd()
			protractorConfig: 'my-protractor-config.conf' // default value: 'protractor-conf.js'
    	};
  	}

## Usage
Mocks are defined as JSON objects describing the request and response for a particular HTTP call:

  	  {
		request: {
	      path: '/users/1',
	      method: 'GET'
	    },
	    response: {
	      data: {
	        userName: 'pro-mock',
	        email: 'pro-mock@email.com'
	      }
	    }
	  }

And then set the mock at the beginning of your test before your application loads:

	var mock = require('protractor-http-mock');
	...

	  mock([{
	    request: {
	      path: '/users/1',
	      method: 'GET'
	    },
	    response: {
	      data: {
	        userName: 'pro-mock',
	        email: 'pro-mock@email.com'
	      }
	    }
	  }]);

Make sure to clean up after test execution. This should be typically done in the `afterEach` call to ensure the teardown is executed regardless of what happens in the test execution:

	afterEach(function(){
	  mock.teardown();
	});

Please note that the `mock()` function needs to be called before the browser opens. If you have different mock data for different tests, please make sure that, either the tests always start in a new browser window, or that its possible to setup all the mocks for each test case before any of tests start running.

### Mock files
Mocks can also be loaded from physical files located in the `mocks.dir` directory that we defined in our configuration:

  	tests
	    e2e
	      protractor.conf.js
	      mocks
	        users.js
	      specs
	        ...


You could simply load your mocks as follows:

	mock(['users']);

Files are structured as standard node modules. The strings passed are the path of the file relative to the mocks directory - the same as if you would be doing a standard `require()` call.

	module.exports = { ... }; // for a single mock.

or

	module.exports = [ ... ]; // for multiple mocks.


### Schema
The full GET schema for defining your mocks is as follows:

	  request: {
	    path: '/products/1/items',
	    method: 'GET',
			regex: false, // Boolean to enable Regular Expression matching on path. This is an optional field.
	    params: { // These match params as they would be passed to the $http service. This is an optional field.
	      page: 2,
	      status: 'onsale'
	    },
	    queryString: { // These match query string parameters that are part of the URL as passed in to the $http service. This is an optional field.
	      param1: 'My first qs parameters',
	      param2: 'Second parameter'
	    },
	    headers: { //These match headers as the end result of the expression provided to the $http method.
	    	head1: 'val1',
	    	head2: 'val2'
	    }
	  },
	  response: {
	  	data: {}, // This is the return value for the matched request
	    status: 500 // The HTTP status code for the mocked response. This is an optional field.
	    delay: 2 // number of milliseconds to delay sending back the response.
	  }

A full mock for a POST call takes the following options:

	  request: {
	    path: '/products/1/items',
	    method: 'POST',
			regex: false, // Boolean to enable Regular Expression matching on path. This is an optional field.
	    data: { // These match POST data. This is an optional field.
	      status: 'onsale',
	      title: 'Blue Jeans',
          price: 24.99
	    }
	  },
	  response: {
	    data: { // This is the return value for the matched request
	      status: 'onsale',
	      title: 'Blue Jeans',
          id: 'abc123',
          price: 24.99
        },
	    status: 204 // The HTTP status code for the mocked response. This is an optional field.
	  }

PUT, DELETE, HEAD, PATCH, and JSONP methods are also supported. Please see the examples in the source code for more information.

#### Request
Defining `params`, `queryString`, `headers`, or `data` will help the plugin match more specific responses but neither is required. Both correspond to their matching objects as they would be passed into the $http object call.

Headers must be defined as the headers that will be used in the http call. Therefore, if in the code to be tested, the headers are defined using properties with function values, these functions will be evaluated as per the $http specification and matched by end result.

#### Response
The default `status` value is 200 if none is specified.

An optional `delay` value can be set on the response to assert any state that occurs when waiting for the response in your application, i.e. loading messages or spinners. Please note that UI tests with timing expectations can be somewhat unstable and provide inconsistent results. Please use this feature carefully.

### Precendence
protractor-http-mock will respond with the **last** matched request in case there are several matches. The plugin will start matching the default mocks first, followed by those added within the test itself in the order they are added. In other words, the last mock defined will always win.

### Inspection
For testing or debugging purposes, it is possible to extract a list of http requests. Simply call the `requestsMade` function as follows:

	var mock = require('protractor-http-mock');
	...

	  expect(mock.requestsMade()).toEqual([
			{ url : '/default', method : 'GET' },
			{ url : '/users', method : 'GET' }
		]);

It is also possible to clear the list of requests with the `clearRequests()` method.

If you wish to assert anything but the full list of requests, then you can do the following to piece out the information needed on the requests:

	mock.requestsMade().then(function(requests){
		expect(requests[1]).toEqual({ url : '/users', method : 'GET' })
	});

### Runtime mocks
If there is a need to add or remove mocks during test execution, please use the `add()` and `remove()` functions:

	mock.add([{
		request: {
			path: '/users',
			method: 'GET',
			params: {
				name: 'Charlie'
			}
		},
		response: {
			data: {
				name: 'Override'
			}
		}
	}]);

	...

	mock.remove([{
		request: {
			path: '/users',
			method: 'GET',
			params: {
				name: 'Charlie'
			}
		},
		response: {
			data: {
				name: 'Override'
			}
		}
	}]);

These will dynamically modify your current set of mocks, and any new request that happens after that will work with the updated set of mocks. Please note that these functions only work by adding or removing mocks using inline objects. As of now, it is not possible to add or remove mocks using mock files.

### Plugins

Plugins can be used to extend the matching functionality of protractor-http-mock. These are separate from protractor plugins.

A plugin can be defined as either an NPM package or a function.

They can be declared in your protractor configuration to be consumed by all your tests:

	baseUrl: 'http://localhost:8000/',
    specs: [
      'spec/*.spec.js'
    ],
    httpMockPlugins: {
      default: ['protractor-http-mock-sample-plugin']
    }

or in each individual test:

	mock([
		//mocks go here
	], [
		{
			match: function(mockRequest, requestConfig){
				...
			}
		}
	]);

Note that in both your protractor configuration and tests, a plugin can be declared as either an npm package name, or definining the object inline.

See this [sample plugin](https://github.com/atecarlos/protractor-http-mock-sample-plugin) for more information.

### Defaults

If necessary, default mocks and plugins can be skipped for a particular test simply by passing true at the end of your `mock` call:

	mock(mocks, plugins, true);


### Examples
Included in the code base is an extensive list examples on how to use all the features of this plugin. Please take a look if you have any questions.

To run these tests locally, please follow these steps from the root directory:

1. `npm install`
2. `npm run webdriver-update`
3. `npm run example`
