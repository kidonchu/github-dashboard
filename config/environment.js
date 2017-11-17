/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'github-dashboard',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

	// Load AIP keys and other secrets from dotenv file
	try {
		let dotenv = require('./dotenv.js');

		Object.keys(dotenv).forEach(function(key) {
			ENV[key] = dotenv[key];
		});
	} catch(err) {
		console.error(err);
		console.log("config/dotenv.js not found");
	}

  if (environment === 'development') {
	  ENV['ember-cli-mirage'] = {
		  enabled: false
	  };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    ENV.rootURL = '/github-dashboard';
    ENV.locationType = 'hash';
	  ENV['ember-cli-mirage'] = {
		  enabled: true
	  };
  }

  return ENV;
};

// vim: set shiftwidth=2 expandtab tabstop=2:
