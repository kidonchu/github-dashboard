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
			let body = this.get('body');

			// if empty body, get body from review comments
			if(body === '') {
				body = this.get('comments').reduce((accumulator, comment) => {
					return accumulator + ' ' + comment.get('body');
				}, '');
			}

			let maxLength = 170;
			if(body.length > maxLength) {
				body = body.substring(0, maxLength) + '...';
			}

			let color = '';
			let action = '';

			switch(this.get('state')) {
				case 'approved':
					color = 'green';
					action = 'approved';
					break;
				case 'changes_requested':
					color = 'red';
					action = 'requested changes';
					break;
				case 'commented':
					color = 'orange';
					action = 'reviewed';
					break;
			}

			return Ember.String.htmlSafe(
				`<span class="${color} bold">${action} (${numComments}).</span> ${body}`
			);
		}
	),
});
