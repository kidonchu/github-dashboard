import Ember from 'ember';
import DS from 'ember-data';

const { computed } = Ember;

export default DS.Model.extend({
	body: DS.attr('string'),
	state: DS.attr('string'),
	submittedAt: DS.attr('date'),

	author: DS.belongsTo('user', {async:true}),
	pull: DS.belongsTo('pull', {async:true}),

	authorLogin: computed.alias('author.login'),
	authorName: computed.alias('author.name'),

	comments: computed('pull.reviewComments.[]', function() {
		let reviewComments = this.get('pull.reviewComments');
		reviewComments = reviewComments.filter((comment) => {
			let reviewId = parseInt(comment.get('review.id'), 10);
			return reviewId === parseInt(this.get('id'), 10);
		});
		return reviewComments;
	}),

	fullBody: computed(
		'state', 'body', 'comments.[]',
		function() {
			let numComments = this.get('comments.length');
			switch(this.get('state')) {
				case 'approved':
					return Ember.String.htmlSafe(
						`<span class="green bold">approved (${numComments}).</span> ${this.get('body')}`
					);
				case 'changes_requested':
					return Ember.String.htmlSafe(
						`<span class="red bold">requested changes (${numComments}).</span> ${this.get('body')}`
					);
				case 'commented':
					return Ember.String.htmlSafe(
						`<span class="orange bold">reviewed (${numComments}).</span> ${this.get('body')}`
					);
				default:
					return Ember.String.htmlSafe(
						`<span class="bold">unknown state.</span> ${this.get('body')}`
					);
			}
			return '';
		}
	),
});
