import Ember from 'ember';
import DS from 'ember-data';

const { computed } = Ember;

export default DS.Model.extend({
	number: DS.attr('number'),
	title: DS.attr('string'),
	htmlUrl: DS.attr('string'),
	body: DS.attr('string'),
	state: DS.attr('string'),
	createdAt: DS.attr('date'),
	updatedAt: DS.attr('date'),

	repo: DS.belongsTo('repository', {async: true}),
	author: DS.belongsTo('user', {async: true}),
	reviews: DS.hasMany('review', {async: true}),
	issueComments: DS.hasMany('comment', {async: true}),
	reviewComments: DS.hasMany('comment', {async: true}),

	authorLogin: computed.alias('author.login'),

	description: computed('body', function() {
		let description = this.get('body').replace(/[\s]?[#]+ Description[\s]*/i, '');
		description = description.replace(/[\s]?[#]+ Acceptance criteria[\s\S]*$/i, '');
		return description;
	}),
});
