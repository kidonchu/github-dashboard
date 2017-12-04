import DS from 'ember-data';

export default DS.Model.extend({
	number: DS.attr('number'),
	title: DS.attr('string'),
	htmlUrl: DS.attr('string'),
	body: DS.attr('string'),
	state: DS.attr('string'),

	author: DS.belongsTo('user', {async: true}),
	reviews: DS.hasMany('review', {async: true}),
	issueComments: DS.hasMany('comment', {async: true}),
	reviewComments: DS.hasMany('comment', {async: true}),
});
