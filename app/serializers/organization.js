import GithubSerializer from 'ember-data-github/serializers/github';

export default GithubSerializer.extend({
	normalize(modelClass, hash, prop) {
		hash = {
			id: hash.recordId || hash.login,
			login: hash.login,
			name: hash.name,
			avatarUrl: hash.avatar_url,
			links: {
				users: hash.members_url.replace(/\{\/member\}/, ''),
				repositories: hash.repos_url + '?type=private&per_page=100',
			}
		};
		return this._super(modelClass, hash, prop);
	}
});
