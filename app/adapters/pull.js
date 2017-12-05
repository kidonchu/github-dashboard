import GithubPullAdapter from 'ember-data-github/adapters/github-pull';

export default GithubPullAdapter.extend({

	urlForFindRecord(id/*, modelName, snapshot */) {

		let parts = id.split('-');
		let repo = parts[0];
		let number = parts[1];

		return `${this.get('host')}/repos/ActiveCampaign/${repo}/pulls/${number}`;
	},

	urlForQueryRecord(query) {
		const {repo, number} = query;
		delete query.repo;
		delete query.number;

		return `${this.get('host')}/repos/${repo}/pulls/${number}`;
	}
});
