# Protractor Mock
A NodeJS module to be used alongside [Protractor](https://github.com/angular/protractor) to facilitate setting up mocks for HTTP calls for the AngularJS applications under test. 

This allows the developer to isolate the UI and client-side application code in our tests without any dependencies on an API.

This plugin does not depend on Angular Mocks (ngMockE2E) being loaded into your app; therefore, there is no need to modify anything within your current Angular web application.

## Installation
	npm install git+ssh://git@gitlab.trad.tradestation.com:2222/catencio/protractor-mock.git --save-dev
## Setup
Within the protractor.conf.js file, add the following:

  	mocks: {
    	default: ['mock-login'], // Specify any default mocks that you would like to load for every test
    	dir: 'mocks' // Specify the location of your mocks relative to the location of the protractor.conf.file
  	},
  	onPrepare: function(){
    	require('protractor-mock').config = {
      		dir: __dirname // Let the plugin know where to find this protractor.conf.js file and your mocks.
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

	var mock = require('protractor-mock');
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

Make sure to clean up after test execution. This should be typically done in the "afterEach" call to ensure the teardown is executed regardless of what happens in the test execution:

	afterEach(function(){
	  mock.teardown();
	});


Mocks can also be loaded from other files located in the "mocks.dir" defined in the web.config. 

  	tests
	    e2e
	      protractor.conf.js
	      mocks
	        users.js
	      specs
	        ...

Given this directory structure and this configuration in your protractor.conf.js
  
	  mocks: {
	    default: [], // Specify any default mocks that you would like to load for every test
	    dir: 'mocks' // Specify the location of your mocks relative to the location of the protractor.conf.file
	  }

You could simply load your mocks as follows

	mock(['users']);


## Mocks
The full schema for defining your mocks is as follows:

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

#### Request
Defining `params` will help the plugin match more specific responses but it is not required. If the `params` are not set, then it will not be taken into account when matching a request.

Protractor mock will respond with the **last** matched request in case there are several matches.

#### Response
The default `status` value is 200 if none is specified.
