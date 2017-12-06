import GithubAdapter from 'ember-data-github/adapters/github';
import ENV from 'github-dashboard/config/environment';

export default GithubAdapter.extend({

	urlForCreateRecord(modelName, snapshot) {
		let issue = snapshot.belongsTo('pull');
		let repo = issue.belongsTo('repo');
		return `${this.get('host')}/repos/${ENV.ORGANIZATION}/${repo.attr('name')}/issues/${issue.attr('number')}/comments`;
	},
});
