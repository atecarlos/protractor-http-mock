# Protractor Mock
A NodeJS module to be used alongside [Protractor](https://github.com/angular/protractor) to facilitate setting up mocks for HTTP calls for the AngularJS applications under test. 

This allows the developer to isolate the UI and client-side application code in our tests without any dependencies on an API.

**This plugin does not depend on Angular Mocks (ngMockE2E) being loaded into your app; therefore, there is no need to modify anything within your current Angular web application.**

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
			protractorConfig: 'my-protractor-config.conf' // default value: 'protractor.conf'
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
	  }

A full mock for a POST call takes the following options:

	  request: {
	    path: '/products/1/items',
	    method: 'POST',
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

Protractor mock will respond with the **last** matched request in case there are several matches.

#### Response
The default `status` value is 200 if none is specified.

### Inspection
For testing or debugging purposes, it is possible to extract a list of http requests. Simply call the `requestsMade` function as follows:

	var mock = require('protractor-http-mock');
	...

	  expect(mock.requestsMade()).toEqual([
			{ url : '/default', method : 'GET' },
			{ url : '/users', method : 'GET' }
		]);

It is also possible to clear the list of requests with the `clearRequests()` method.
		
### Examples
Included in the code base is an extensive list examples on how to use all the features of this plugin. Please take a look if you have any questions.

To run these tests locally, please follow these steps from the root directory:

1. `npm install`
2. `node_modules/.bin/webdriver-manager update`
3. `npm run example`


### Contributions and recognition

* `jdgblinq` for their contribution to query string matching.
* `ReactiveRaven` for adding convenience methods key for getting this to work with ngResource.
* `nielssj` for the `requestsMade` functionality and for pointing out a few bugs.
* `nadersoliman` for their input and pull request on allowing the user to set custom name for the protractor configuration file.
* `kharnt0x` for submitting a bug fix for proper callback handling.
* `zigzackattack` for their contribution on post data matching.
* `matthewjh` for their pull request to allow the plugin to play nice with interceptors.
* `stevehenry13` for their pull request to allow the plugin to work with transforms.
* `brandonroberts` for the fantastic work on interceptors and promises.
