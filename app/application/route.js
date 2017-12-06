import Ember from 'ember';
import ENV from 'github-dashboard/config/environment';

const { Route } = Ember;
const { allSettled, Promise } = Ember.RSVP;

export default Route.extend({

	model() {
		return new Promise((resolve, reject) => {
			this.store.findRecord('organization', ENV.ORGANIZATION).then(org => {
				org.get('repos').then((repos) => {
					resolve(repos);
				});
			}).catch(err => reject(err));
		});
	},

	/**
	 * Loads pull requests from whitelisted repos within the organization
	 *
	 * @event setupController
	 * @param {Controller.Application} controller
	 * @param {Promise} model
	 */
	setupController(controller, model) {

		controller.set('loading', true);

		let repos = model.filter(function(repo) {
			if(ENV.WHITELISTED_REPOS.indexOf(repo.get('name')) === -1) {
				return false;
			}
			return true;
		});

		// make sure all repos' pulls are fetched before doing anything
		let promises = [];
		repos.forEach(function(repo) {
			promises.push(repo.get('pulls'));
		});

		allSettled(promises).then((hash) => {
			let pulls = [];
			hash.forEach((promise) => {
				pulls = pulls.concat(promise.value.toArray());
			});
			controller.set('pulls', pulls);
			controller.set('loading', false);
		});
	},

	actions: {

		addComment(pull, comment) {
			let user = this.store.peekRecord('user', 'kidonchu');
			let newComment = this.store.createRecord('comment', {
				body: comment,
				author: user,
				pull: pull,
			});

			return newComment.save();
		},
	},
});
