import DS from 'ember-data';
import Ember from 'ember';

const { computed } = Ember;

export default DS.Model.extend({
	body: DS.attr('string'),
	createdAt: DS.attr('date'),
	author: DS.belongsTo('user', {async: true}),
	htmlUrl: DS.attr('string'),

	pull: DS.belongsTo('pull', {async: true}),

	hasBody: computed.notEmpty('body'),

	authorLogin: computed.alias('author.login'),
	authorName: computed.alias('author.name'),

	fullBody: computed('body', function() {

		let body = this.get('body');
		let maxLength = 170;
		if(body.length > maxLength) {
			body = body.substring(0, maxLength) + '...';
		}
		return body;

	}),
});
