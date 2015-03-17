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
	    params: { // These match the querystring params. This is an optional field.
	      page: 2,
	      status: 'onsale'
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

#### Request
Defining `params` or `data` will help the plugin match more specific responses but neither is required. If the `params` and/or `data` are not set, then it will not be taken into account when matching a request.

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
		
### Examples
Included in the code base is an extensive list examples on how to use all the features of this plugin. Please take a look if you have any questions.

To run these tests locally, please follow these steps from the root directory:

1. `npm install`
2. `node_modules/.bin/webdriver-manager update`
3. `npm run example`


### Contributions and recognition

* `ReactiveRaven` for adding convenience methods key for getting this to work with ngResource.
* `nielssj` for the `requestsMade` functionality and for pointing out a few bugs.
* `nadersoliman` for his input and pull request on allowing the user to set custom name for the protractor configuration file.
* `kharnt0x` for submitting a bug fix for proper callback handling.
