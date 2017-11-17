import Ember from 'ember';

const { Component } = Ember;

export default Component.extend({
	/**
	 * @property attributeBindings
	 * @type {String[]}
	 * @default ['viewBox']
	 */
	attributeBindings: [
		'viewBox'
	],

	/**
	 * @property classNames
	 * @type {String[]}
	 * @default ['icon']
	 */
	classNames: [
		'components_svg-icon',
		'icon'
	],

	/**
	 * ID of the SVG symbol in the spritesheet
	 *
	 * @property iconId
	 * @type {String}
	 * @public
	 */
	iconId: '',

	/**
	 * @property tagName
	 * @type {String}
	 * @default 'svg'
	 */
	tagName: 'svg',

	/**
	 * The viewBox for the SVG element
	 *
	 * @property viewBox
	 * @type {String}
	 * @default '0 0 16 16'
	 * @public
	 */
	viewBox: '0 0 16 16',
});
