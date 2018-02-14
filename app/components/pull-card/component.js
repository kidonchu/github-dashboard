import Ember from 'ember';
import DS from 'ember-data';

const { Component, computed } = Ember;
const { service } = Ember.inject;

export default Component.extend({

	store: service(),
	tagName: 'article',
	classNames: ['components_pull-card'],

	showDescription: true,

	commentValue: '',

	/**
	 * @property isShowingAllComments
	 * @type {Boolean}
	 * @default false
	 */
	isShowingAllComments: false,

	comments: computed(
		'pull.reviews.@each.id',
		'pull.reviews.@each.authorLogin',
		'pull.reviews.@each.authorName',
		'pull.reviewComments.@each.id',
		'pull.reviewComments.@each.authorLogin',
		'pull.reviewComments.@each.authorName',
		'pull.issueComments.@each.id',
		'pull.issueComments.@each.authorLogin',
		'pull.issueComments.@each.authorName',
		function() {

			// make sure review's comments are loaded with other models
			// so that we can display number of review comments per review
			let promise = new Ember.RSVP.Promise((resolve) => {
				Ember.RSVP.hash({
					reviews: this.get('pull.reviews'),
					issueComments: this.get('pull.issueComments'),
					reviewComments: this.get('pull.reviewComments'),
				}).then((promises) => {
					resolve(promises);
				});
			}).then((promises) => {
				let reviews = promises.reviews.toArray();
				let issueComments = promises.issueComments.toArray();

				let comments = reviews.map((review) => {
					return Ember.Object.create({
						author: review.get('authorLogin'),
						authorName: review.get('authorName'),
						body: Ember.String.htmlSafe(review.get('fullBody')),
						createdAt: review.get('submittedAt'),
						url: review.get('htmlUrl'),
					});
				});

				comments = comments.concat(issueComments
					.filterBy('hasBody')
					.map((comment) => {
						return Ember.Object.create({
							author: comment.get('authorLogin'),
							authorName: comment.get('authorName'),
							body: Ember.String.htmlSafe(comment.get('fullBody')),
							createdAt: comment.get('createdAt'),
							url: comment.get('htmlUrl'),
						});
					})
				);

				comments = comments.sortBy('createdAt');

				return comments;
			});

			return DS.PromiseArray.create({
				promise: promise,
			});
		}
	),

	numComments: computed.alias('comments.length'),
	hasMultipleComments: computed.gt('numComments', 2),

	pullFirstComment: computed('pull.number', 'pull.repo.name', function() {
		let repo = this.get('pull.repo');
		let pull = this.get('pull');
		let comment = 'created the PR ';
		comment += `<a href="${repo.get('htmlUrl')}" target="_blank">#${repo.get('name')}</a> `;
		comment += `<a href="${pull.get('htmlUrl')}" target="_blank">#${pull.get('number')}</a>`;

		return Ember.String.htmlSafe(comment);
	}),

	/**
	 * Last two reviews of current pull
	 *
	 * {{#dependentProperties}}
	 * reviews.[]
	 * {{/dependentProperties}}
	 *
	 * @property lastComments
	 * @type {Model.Review[]}
	 */
	lastComments: computed('comments.[]', function() {
		let comments = this.get('comments').toArray();
		let begin = Math.max(0, comments.length - 2);
		return comments.slice(begin);
	}),

	lastComment: computed('lastComments.[]', function() {
		let lastComments = this.get('lastComments');
		if(lastComments.length > 0) {
			return lastComments[lastComments.length - 1];
		}
		return null;
	}),

	statusClass: computed('pull.state', function() {
		switch(this.get('pull.state')) {
			case 'approved':
				return 'green';
			case 'changes_requested':
				return 'red';
			default:
				return 'grey';
		}
	}),

	actions: {
		showAllComments() {
			this.set('isShowingAllComments', true);
		},

		onCommentKeyDown(e) {
			// Ctrl + Enter
			if(e.keyCode === 13 && e.ctrlKey) {
				if(!this.get('commentValue')) {
					return;
				}

				let promise = this.addComment(this.get('pull'), this.get('commentValue'));
				promise.then(() => {
					this.set('commentValue', '');
				}).catch((error) => {
					console.error(error);
					alert('An error occurred while adding a comment. Please check your console for more details.');
				});
			} else if(e.keyCode === 50) {
				// @TODO auto-completion of github mentions
				return;
			}
		}
	}
});
