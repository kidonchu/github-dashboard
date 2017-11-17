import Ember from 'ember';

const { Component, computed, observer } = Ember;
const { service } = Ember.inject;

export default Component.extend({

	store: service(),
	tagName: 'article',
	classNames: ['components_pull-card'],

	allComments: [],

	commentValue: '',

	/**
	 * @property isShowingAllComments
	 * @type {Boolean}
	 * @default false
	 */
	isShowingAllComments: false,

	getPullComments: observer(
		'pull.reviews.content.isLoaded', 'pull.reviews.@each.author',
		'pull.comments.content.isLoaded', 'pull.comments.@each.author',
		function() {
			this.set('comments', []);

			let comments = [];

			this.get('pull.reviews').map((review) => {
				if(review.get('state') === 'changes_requested' ||
					review.get('state') === 'approved' ||
					review.get('hasBody')
				) {
					comments.push(Ember.Object.create({
						author: review.get('author.login'),
						authorName: review.get('author.name'),
						body: Ember.String.htmlSafe(review.get('fullBody')),
						createdAt: review.get('submittedAt'),
					}));
				}
			});

			this.get('pull.comments').map((comment) => {
				if(comment.get('hasBody')) {
					comments.push(Ember.Object.create({
						author: comment.get('author.login'),
						authorName: comment.get('author.name'),
						body: Ember.String.htmlSafe(comment.get('body')),
						createdAt: comment.get('createdAt'),
					}));
				}
			});

			comments = comments.sortBy('createdAt');

			this.set('comments', comments);
		}
	),

	numComments: computed.alias('comments.length'),
	hasMultipleComments: computed.gt('numComments', 2),

	pullFirstComment: computed('pull.number', 'pull.baseRepo', function() {
		let repo = this.get('pull.baseRepo');
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
		let comments = this.get('comments');
		if(!comments) {
			return [];
		}

		let begin = Math.max(0, comments.length - 2);

		return comments.slice(begin);
	}),

	statusClass: computed('pull.state', function() {
		switch(this.get('pull.state')) {
			case 'approved':
				return 'green';
			case 'changes_requested':
				return 'red';
			case 'in_progress':
				return 'yellow';
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
				promise.then((comment) => {
					if(comment && comment.get('id')) {
						comment.get('author').then((author) => {
							this.get('comments').pushObject(Ember.Object.create({
								author: author.get('login'),
								authorName: author.get('name'),
								body: Ember.String.htmlSafe(comment.get('body')),
								createdAt: comment.get('createdAt'),
							}));
						});
					}
					this.set('commentValue', '');
				}).catch((error) => {
					alert(error.statusText);
				});
			} else if(e.keyCode === 50) {
				console.log('@ pressed');
			}
		}
	}
});
