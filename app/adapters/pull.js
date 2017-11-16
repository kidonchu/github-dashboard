import GithubPullAdapter from 'ember-data-github/adapters/github-pull';

export default GithubPullAdapter.extend({
	urlForQueryRecord(query) {
		const {repo, number} = query;
		delete query.repo;
		delete query.number;

		return `${this.get('host')}/repos/${repo}/pulls/${number}`;
	}
});
