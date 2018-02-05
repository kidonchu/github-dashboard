import DS from 'ember-data';

export default DS.Model.extend({
	fullName: DS.attr('string'),
	name: DS.attr('string'),
	htmlUrl: DS.attr('string'),

	pulls: DS.hasMany('pull', { async: true }),
	mergedPulls: DS.hasMany('pull', { async: true, inverse: null }),
});
