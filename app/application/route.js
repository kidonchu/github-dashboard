import Ember from 'ember';
import ENV from 'github-dashboard/config/environment';

const { Route } = Ember;
const { hash, Promise } = Ember.RSVP;

export default Route.extend({

	model() {
		return new Promise((resolve, reject) => {
			this.store.findRecord('organization', ENV.ORGANIZATION).then(org => {
				hash({
					activeCampaign: org,
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
		let repos = model.repos.filter(function(repo) {
			if(ENV.WHITELISTED_REPOS.indexOf(repo.get('name')) === -1) {
				return false;
			}
			return true;
		});

		repos.forEach(function(repo) {
			repo.get('pulls').then((p) => {
				let pulls = controller.get('pulls');
				pulls = pulls.concat(p.toArray());
				controller.set('pulls', pulls);
			});
		});
	}
});
