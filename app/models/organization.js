import DS from 'ember-data';

export default DS.Model.extend({
	login: DS.attr('string'),
	name: DS.attr('string'),

	repos: DS.hasMany('repository', { async: true })
});
