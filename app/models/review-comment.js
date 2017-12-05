import DS from 'ember-data';
import Ember from 'ember';

const { computed } = Ember;

export default DS.Model.extend({
	body: DS.attr('string'),
	createdAt: DS.attr('date'),
	author: DS.belongsTo('user', {async: true}),
	review: DS.belongsTo('review', {async: true}),

	authorLogin: computed.alias('author.login'),
	authorName: computed.alias('author.name'),
});
