import Ember from 'ember';
import DS from 'ember-data';

const { computed } = Ember;
const { bool } = computed;

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
	isOpen: DS.attr('boolean'),
	htmlUrl: DS.attr('string'),
	body: DS.attr('string'),
	createdAt: DS.attr('date'),
	updatedAt: DS.attr('date'),
	closedAt: DS.attr('date'),
	mergedAt: DS.attr('date'),
	userLogin: DS.attr('string'),
	userAvatarUrl: DS.attr('string'),

	assignee: DS.belongsTo('user', { async: true }),
	author: DS.belongsTo('user', {
		async: true,
		inverse: null
	}),
	reviews: DS.hasMany('review', {async: true}),
	comments: DS.hasMany('comment', {async: true}),
	baseRepo: DS.belongsTo('repository', {async: true}),

	lastReviewState: computed('reviews.isFulfilled', 'reviews.content.isLoaded', function() {
		if(!this.get('reviews.isFulfilled') || !this.get('reviews.content.isLoaded')) {
			this.get('reviews');
			return null;
		}

		let reviews = this.get('reviews').toArray();
		return getLastReviewState(reviews, reviews.length - 1);
	}),

	isApproved: computed('lastReviewState', function() {
		return this.get('lastReviewState') === 'approved';
	}),

	isChangesRequested: computed('lastReviewState', function() {
		return this.get('lastReviewState') === 'changes_requested';
	}),

	isInProgress: computed('assignee.login', 'author.login', function() {
		return this.get('assignee.login') !== this.get('author.login');
	}),

	/**
	 * Whether the PR was merged
	 *
	 * @property isMerged
	 * @type {Boolean}
	 */
	isMerged: bool('mergedAt'),

	/**
	 * Whether the PR was closed without merging
	 *
	 * @property isClosed
	 * @type {Boolean}
	 */
	isClosed: computed('isMerged', 'closedAt', function() {
		return this.get('closedAt') && !this.get('isMerged');
	}),

	state: computed('isOpen', 'isApproved', 'isChangesRequested', 'isInProgress', function() {
		if(this.get('isApproved')) {
			return 'approved';
		} else if(this.get('isChangesRequested')) {
			return 'changes_requested';
		} else if(this.get('isInProgress')) {
			return 'in_progress';
		} else {
			return 'waiting';
		}
	}),
});
