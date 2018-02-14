import GithubAdapter from 'ember-data-github/adapters/github';
import ENV from 'github-dashboard/config/environment';

export default GithubAdapter.extend({

	urlForFindRecord(id/*, modelName, snapshot */) {

		let parts = id.split(':');
		let repo = parts[0];
		let number = parts[1];

		return `${this.get('host')}/repos/${ENV.ORGANIZATION}/${repo}/pulls/${number}`;
	},

	urlForCreateRecord(modelName, snapshot) {
		let issue = snapshot.belongsTo('pull');
		let repo = issue.belongsTo('repo');
		return `${this.get('host')}/repos/${ENV.ORGANIZATION}/${repo.attr('name')}/issues/${issue.attr('number')}/comments`;
	},
});
