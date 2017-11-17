import Ember from 'ember';
import ENV from '../config/environment';

const { computed, Controller, run } = Ember;
const { service } = Ember.inject;

/**
 * @class Application
 * @namespace Controller
 * @extends Ember.Controller
 */
export default Controller.extend({

	store: service(),

	pulls: [],

	numPulls: computed('filteredPulls.[]', function() {
		return this.get('filteredPulls').length;
	}),

	/**
	 * List of pulls filtered by various filters
	 *
	 * @property filteredPulls
	 * @type {Model.Pull[]}
	 */
	filteredPulls: computed(
		'pulls.@each.{title,state,author}',
		function() {
			let pulls = this.get('pulls').filter((pull) =>  {

				// repo filter
				if(ENV.REPO_FILTERS.indexOf(pull.get('baseRepo.name')) !== -1) {
					return true;
				}

				// author filter
				if(ENV.USER_FILTERS.indexOf(pull.get('userLogin')) !== -1) {
					return true;
				}

				return false;
			});

			pulls = pulls.sort((a, b) => {
				if(a.get('state') !== b.get('state')) {
					return (a.get('state') < b.get('state')) ? -1 : 1;
				}
				if(a.get('updatedAt') !== b.get('updatedAt')) {
					return (a.get('updatedAt') < b.get('updatedAt')) ? 1 : -1;
				}
				return 0;
			});

			return pulls;
		}
	),

	actions: {

		/**
		 * @method actions.addComment
		 * @param {Model.Pull} pull
		 * @param {String} comment
		 * @return {Promise}
		 */
		addComment(pull, comment) {
			let repo = pull.get('baseRepo.name');
			let issueId = pull.get('number');
			let url = 'https://api.github.com/repos/';
			url += `${ENV.ORGANIZATION}/${repo}/issues/${issueId}/comments`;

			return new Ember.RSVP.Promise((resolve, reject) => {
				// send ajax request to add comment to current PR
				Ember.$.ajax({
					url: url,
					type: 'post',
					contentType: 'application/json',
					headers: {
						Authorization: 'token ' + ENV.GITHUB_ACCESS_TOKEN
					},
					data: JSON.stringify({
						body: comment
					})
				}).done((data) => {
					run(() => {
						// reload Pull model to update `updatedAt` attribute
						this.get('store').queryRecord('pull', {
							repo: `${ENV.ORGANIZATION}/${repo}`,
							number: pull.get('number')
						});

						// also push created comment to the store
						let payload = { comments: [ data ] };
						this.get('store').pushPayload('comment', payload);

						// resolve with created comment in case additional logic
						// needs to run on component level
						resolve(this.get('store').peekRecord('comment', data.id));
					});
				}).fail((error) => {
					run(() => {
						reject(error);
					});
				});
			});
		},
	}
});
