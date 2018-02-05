import Ember from 'ember';
import DS from 'ember-data';

const { computed } = Ember;

/**
 * Recursively finds last review state
 *
 * @method getLastReviewState
 * @param {Model.Review[]} reviews
 * @param {Number} index
 * @return {String|null}
 */
function getLastReviewState(reviews, index) {

	if(reviews.length < 0 || index < 0) {
		return null;
	}

	let state = reviews[index].get('state').toLowerCase();
	switch(state) {
		case 'approved':
		case 'changes_requested':
			return state;
	}
	return getLastReviewState(reviews, --index);
}

export default DS.Model.extend({
	number: DS.attr('number'),
	title: DS.attr('string'),
	htmlUrl: DS.attr('string'),
	body: DS.attr('string'),
	createdAt: DS.attr('date'),
	updatedAt: DS.attr('date'),
	mergedAt: DS.attr('date'),
	closedAt: DS.attr('date'),

	repo: DS.belongsTo('repository', {async: true}),
	author: DS.belongsTo('user', {async: true}),
	reviews: DS.hasMany('review', {async: true}),
	issueComments: DS.hasMany('comment', {async: true}),
	reviewComments: DS.hasMany('review-comment', {async: true}),

	repoName: computed.alias('repo.name'),
	authorLogin: computed.alias('author.login'),

	description: computed('body', function() {
		let description = this.get('body').replace(/[\s]?[#]+ Description[\s]*/i, '');
		description = description.replace(/[\s]?[#]+ Acceptance criteria[\s\S]*$/i, '');
		return description;
	}),

	lastReviewState: computed('reviews.@each.id', function() {
		let reviews = this.get('reviews').toArray();
		return getLastReviewState(reviews, reviews.length - 1);
	}),

	isApproved: computed('lastReviewState', function() {
		return this.get('lastReviewState') === 'approved';
	}),

	isChangesRequested: computed('lastReviewState', function() {
		return this.get('lastReviewState') === 'changes_requested';
	}),

	isWaiting: computed('isApproved', 'isChangesRequested', function() {
		return !this.get('isApproved') && !this.get('isChangesRequested');
	}),

	isMerged: computed('mergedAt', function() {
		return !!this.get('mergedAt');
	}),

	isClosed: computed('closedAt', function() {
		return !!this.get('closedAt');
	}),

	state: computed(
		'isApproved', 'isChangesRequested',
		function() {
			if(this.get('isApproved')) {
				return 'approved';
			} else if(this.get('isChangesRequested')) {
				return 'changes_requested';
			} else {
				return 'waiting';
			}
		}
	),
});
