import Ember from 'ember';
import ENV from 'github-dashboard/config/environment';

const { Route } = Ember;
const { allSettled, Promise } = Ember.RSVP;

export default Route.extend({

	repos: [],

	watchingPulls: [
		'Hosted:10827'
	],

	/**
	 * Loads pull requests from whitelisted repos within the organization
	 *
	 * @event setupController
	 * @param {Controller.Application} controller
	 * @param {Promise} model
	 */
	setupController() {

		this._super(...arguments);

		let promise = new Promise((resolve) => {
			this.store.findRecord('organization', ENV.ORGANIZATION).then(org => {
				org.get('repos').then((repos) => {
					repos = repos.filter((repo) => {
						if(ENV.WHITELISTED_REPOS.indexOf(repo.get('name')) === -1) {
							return false;
						}
						return true;
					});
					this.set('repos', repos);
					resolve();
				});
			});
		});

		promise.then(() => {
			this.loadPulls().then(() => {
				this.loadMergedPulls();
				this.loadWatchingPulls();
			});
		});
	},

	loadPulls() {
		return new Promise((resolve) => {
			let controller = this.get('controller');
			controller.set('loadingPulls', true);

			// make sure all repos' pulls are fetched before doing anything
			let promises = [];
			this.get('repos').forEach(function(repo) {
				promises.push(repo.get('pulls'));
			});

			allSettled(promises).then((hash) => {
				let pulls = [];
				hash.forEach((promise) => {
					pulls = pulls.concat(promise.value.toArray());
				});
				controller.set('pulls', pulls);
				controller.set('loadingPulls', false);
			}).then(() => {
				resolve();
			});
		});
	},

	loadMergedPulls() {
		let controller = this.get('controller');
		controller.set('loadingMergedPulls', true);

		// make sure all repos' pulls are fetched before doing anything
		let promises = [];
		this.get('repos').forEach(function(repo) {
			promises.push(repo.get('mergedPulls'));
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

	loadWatchingPulls() {
		let controller = this.get('controller');
		controller.set('loadingWatchingPulls', true);

		// make sure all repos' pulls are fetched before doing anything
		let promises = [];
		this.get('watchingPulls').forEach((watching) => {
			promises.push(this.get('store').findRecord('pull', watching));
		});

		allSettled(promises).then((hash) => {
			let pulls = [];
			hash.forEach((promise) => {
				pulls = pulls.concat(promise.value);
			});
			controller.set('watchingPulls', pulls);
			controller.set('loadingWatchingPulls', false);
		});
	},

	actions: {

		addComment(pull, comment) {
			let user = this.store.peekRecord('user', 'kidonchu');
			let newComment = this.store.createRecord('comment', {
				body: comment.trim(),
				author: user,
				pull: pull,
			});

			return newComment.save();
		},

		loadMergedPulls() {
			this.loadMergedPulls();
		}
	},
});
