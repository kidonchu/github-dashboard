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
	statuses: DS.hasMany('status', {async: true}),
	issueComments: DS.hasMany('comment', {async: true}),
	reviewComments: DS.hasMany('review-comment', {async: true}),

	repoName: computed.alias('repo.name'),
	repoUrl: computed.alias('repo.htmlUrl'),
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

	sortedStatuses: computed(
		'statuses.@each.id',
		'statuses.isFulfilled',
		'statuses.content.isLoaded',
		function() {

			if (!this.get('statuses.length')) {
				return [];
			}

			let a = this.get('statuses').toArray().sort((a, b) => {
				// sort by updatedAt DESC
				if (a.get('updatedAt') === b.get('updatedAt')) {
					return 0;
				}
				return a.get('updatedAt') < b.get('updatedAt') ? 1 : -1;
			});

			return a;
		}
	),

	isStatusSuccess: computed(
		'sortedStatuses.[]',
		function() {
			return this.get('sortedStatuses.firstObject.isSuccess');
		}
	),

	isStatusFailure: computed(
		'sortedStatuses.[]',
		function() {
			return this.get('sortedStatuses.firstObject.isFailure');
		}
	),
});
