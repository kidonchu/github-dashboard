import GithubSerializer from 'ember-data-github/serializers/github';

export default GithubSerializer.extend({
	normalize(modelClass, hash, prop) {
		let newHash = {
			id: hash.id,
			body: hash.body,
			state: hash.state.toLowerCase(),
			submittedAt: hash.submitted_at,
			links: {
				author: hash.user.url
			}
		};

		return this._super(modelClass, newHash, prop);
	}
});
