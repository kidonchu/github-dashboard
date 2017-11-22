import Ember from 'ember';
import ENV from 'github-dashboard/config/environment';

const { Route } = Ember;
const { allSettled, hash, Promise } = Ember.RSVP;

export default Route.extend({

	model() {
		return new Promise((resolve, reject) => {
			this.store.findRecord('organization', ENV.ORGANIZATION).then(org => {
				hash({
					organization: org,
					repos: org.get('repositories'),
				}).then(hash => resolve(hash));
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

		let repos = model.repos.filter(function(repo) {
			if(ENV.WHITELISTED_REPOS.indexOf(repo.get('name')) === -1) {
				return false;
			}
			return true;
		});

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
	}
});
