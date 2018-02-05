import Ember from 'ember';
import DS from 'ember-data';

const { computed } = Ember;

export default DS.Model.extend({
	number: DS.attr('number'),
	title: DS.attr('string'),
	htmlUrl: DS.attr('string'),
	createdAt: DS.attr('date'),
	updatedAt: DS.attr('date'),
	mergedAt: DS.attr('date'),
	closedAt: DS.attr('date'),

	repo: DS.belongsTo('repository', {async: true}),
	author: DS.belongsTo('user', {async: true}),

	repoName: computed.alias('repo.name'),
	authorLogin: computed.alias('author.login'),

	isMerged: computed('mergedAt', function() {
		return !!this.get('mergedAt');
	}),

	isClosed: computed('closedAt', function() {
		return !!this.get('closedAt');
	}),
});
