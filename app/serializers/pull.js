import GithubSerializer from 'ember-data-github/serializers/github';

export default GithubSerializer.extend({
	normalize(modelClass, hash, prop) {
		let modelHash = {
			id: hash.id,
			number: hash.number,
			title: hash.title,
			isOpen: (hash.state === 'open'),
			htmlUrl: hash.html_url,
			body: hash.body,
			createdAt: hash.created_at,
			updatedAt: hash.updated_at,
			closedAt: hash.closed_at,
			mergedAt: hash.merged_at,
			userAvatarUrl: hash.user.avatar_url,
			userLogin: hash.user.login,
			links: {
				author: hash.user.url,
				baseRepo: hash.base.repo.url,
				reviews: hash.url + '/reviews',
				comments: hash.comments_url,
			}
		};

		// by default, PR is assigned to author
		let assignee = hash.user.url;
		if(hash.assignee) {
			assignee = hash.assignee.url;
		}
		modelHash.links.assignee = assignee;

		return this._super(modelClass, modelHash, prop);
	}
});
