import DS from 'ember-data';

export default DS.Model.extend({
	body: DS.attr('string'),
	state: DS.attr('string'),
	submittedAt: DS.attr('date'),

	author: DS.belongsTo('user', {async:true}),
});
