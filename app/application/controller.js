import Ember from 'ember';
import ENV from '../config/environment';

const { computed, Controller, run } = Ember;
const { service } = Ember.inject;
const { scheduleOnce } = Ember.run;

/**
 * @class Application
 * @namespace Controller
 * @extends Ember.Controller
 */
export default Controller.extend({

	queryParams: ['state', 'author', 'team'],

	store: service(),

	pulls: [],
	mergedPulls: [],

	state: '',
	author: '',
	team: '',

	loadingPulls: true,
	loadingMergedPulls: false,

	stateOptions: ['approved', 'changes_requested', 'waiting'],
	teamOptions: ENV.TEAM_FILTERS,
	authorOptions: ENV.USER_FILTERS,

	init() {
		this._super(...arguments);

		scheduleOnce('afterRender', this, function() {
			Ember.$('body').on('click', '.anchor-link', function(e) {
				run(() => {
					let target = Ember.$(this.getAttribute('href'));
					if( target.length ) {
						e.preventDefault();
						Ember.$('html, body').stop().animate({
							scrollTop: target.offset().top - 30
						}, 300);
					}
				});
			});
		});
	},

	numPulls: computed.alias('filteredPulls.length'),

	numApproved: computed('approvedPulls.[]', function() {
		return this.get('approvedPulls').length;
	}),

	numChangesRequested: computed('changesRequestedPulls.[]', function() {
		return this.get('changesRequestedPulls').length;
	}),

	numWaiting: computed('waitingPulls.[]', function() {
		return this.get('waitingPulls').length;
	}),

	/**
	 * List of pulls filtered by various filters
	 *
	 * @property filteredPulls
	 * @type {Model.Pull[]}
	 */
	filteredPulls: computed(
		'pulls.[]', 'pulls.@each.state',
		'pulls.@each.authorLogin', 'pulls.@each.repoName',
		function() {

			let pulls = this.applyWhitelistFilters(this.get('pulls'));

			pulls = pulls.filter((pull) =>  {
				if (pull.get('isMerged') || pull.get('isClosed')) {
					return false;
				}
				return true;
			});

			pulls = pulls.sort((a, b) => {
				if(a.get('state') !== b.get('state')) {
					return (a.get('state') < b.get('state')) ? -1 : 1;
				}
				if(a.get('updatedAt') !== b.get('updatedAt')) {
					return (a.get('updatedAt') > b.get('updatedAt')) ? 1 : -1;
				}
				return 0;
			});

			return pulls;
		}
	),

	filteredMergedPulls: computed(
		'mergedPulls.[]', 'mergedPulls.@each.authorLogin', 'mergedPulls.@each.repoName',
		function() {

			let pulls = this.applyWhitelistFilters(this.get('mergedPulls'));

			pulls = pulls.filter((pull) =>  {
				if (pull.get('isMerged')) {
					return true;
				}
				return false;
			});

			pulls = pulls.sort((a, b) => {
				if(a.get('mergedAt') !== b.get('mergedAt')) {
					return (a.get('mergedAt') < b.get('mergedAt')) ? 1 : -1;
				}
				return 0;
			});

			return pulls;
		}
	),

	approvedPulls: computed('filteredPulls.[]', function() {
		return this.get('filteredPulls').filterBy('isApproved');
	}),

	changesRequestedPulls: computed('filteredPulls.[]', function() {
		return this.get('filteredPulls').filterBy('isChangesRequested');
	}),

	waitingPulls: computed('filteredPulls.[]', function() {
		return this.get('filteredPulls').filterBy('isWaiting');
	}),

	applyWhitelistFilters(pulls) {

		return pulls.filter((pull) =>  {

			// repo filter
			if(ENV.DEFAULT_REPO_FILTERS.indexOf(pull.get('repoName')) !== -1) {
				return true;
			}

			// author filter
			if(ENV.DEFAULT_USER_FILTERS.indexOf(pull.get('authorLogin')) !== -1) {
				return true;
			}

			return false;
		});
	},

	actions: {
		onStateFilterChange(state) {
			this.set('state', state);
		},

		onAuthorFilterChange(author) {
			this.set('author', author);
		},

		onTeamFilterChange(team) {
			this.set('team', team);
		},
	}
});
