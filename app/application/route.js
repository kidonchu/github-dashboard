import Ember from 'ember';
import ENV from 'github-dashboard/config/environment';

const { Route } = Ember;
const { allSettled, Promise } = Ember.RSVP;

export default Route.extend({

	repos: [],

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

		let repos = model.filter(function(repo) {
			if(ENV.WHITELISTED_REPOS.indexOf(repo.get('name')) === -1) {
				return false;
			}
			return true;
		});

		this.set('repos', repos);

		this.loadPulls();
	},

	loadPulls() {
		let controller = this.get('controller');
		controller.set('loadingPulls', true);

		// make sure all repos' pulls are fetched before doing anything
		let promises = [];
		this.get('repos').forEach(function(repo) {
			promises.push(repo.get('pulls').reload());
		});

		allSettled(promises).then((hash) => {
			let pulls = [];
			hash.forEach((promise) => {
				pulls = pulls.concat(promise.value.toArray());
			});
			controller.set('pulls', pulls);
			controller.set('loadingPulls', false);
		});
	},

	loadMergedPulls() {
		let controller = this.get('controller');
		controller.set('loadingMergedPulls', true);

		// make sure all repos' pulls are fetched before doing anything
		let promises = [];
		this.get('repos').forEach(function(repo) {
			promises.push(repo.get('mergedPulls').reload());
		});

		allSettled(promises).then((hash) => {
			let pulls = [];
			hash.forEach((promise) => {
				pulls = pulls.concat(promise.value.toArray());
			});
			controller.set('mergedPulls', pulls);
			controller.set('loadingMergedPulls', false);
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

		loadPulls() {
			this.loadPulls();
		},

		loadMergedPulls() {
			this.loadMergedPulls();
		}
	},
});
