/* eslint-env node */
'use strict';

const EmberApp     = require('ember-cli/lib/broccoli/ember-app');
const autoprefixer = require('broccoli-autoprefixer');
const fs           = require('fs');

const octicons = fs.readFileSync('./node_modules/octicons/build/sprite.octicons.svg');

module.exports = function(defaults) {
	var app = new EmberApp(defaults, {
		// Add options here
		inlineContent: {
			'octicons': {
				content: '<div style="display: none;">' + octicons + '</div>'
			},
			'kidon': {
				content: '<div style="display:none;">Hello World</div>'
			}
		},
		sassOptions: {
			sourceComments: false,
		},
		sourceMaps: {
			enabled: true,
			extensions: ['js']
		}
	});

	// Use `app.import` to add additional libraries to the generated
	// output files.
	//
	// If you need to use different assets in different
	// environments, specify an object as the first parameter. That
	// object's keys should be the environment name and the values
	// should be the asset to use in that environment.
	//
	// If the library that you are including contains AMD or ES6
	// modules that you would like to import into your application
	// please specify an object with the list of modules as keys
	// along with the exports of each module as its value.

	let tree = app.toTree();

	tree = autoprefixer(tree, {
		browsers: [
			'last 2 versions'
		],
		sourcemap: true
	});

	return tree;
};
