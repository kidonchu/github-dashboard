import DS from 'ember-data';

function trimHost(str) {
	return str.replace('https://api.github.com', '');
}

export default DS.JSONAPISerializer.extend({

	normalizeFindHasManyResponse(store, primaryModelClass, payload, id, requestType){
		let jsonPayload = {
			data: payload.map(this.doNormalize)
		};
		return this._super(store, primaryModelClass, jsonPayload, id, requestType);
	},

	doNormalize(payload) {

		let repo = payload.base.repo;
		let user = payload.user;

		return {
			id: `${repo.name}-${payload.number}`,
			type: 'pull',
			attributes: {
				number: payload.number,
				title: payload.title,
				body: payload.body,
				'html-url': payload.html_url,
				'created-at': payload.created_at,
				'updated-at': payload.updated_at,
				'merged-at': payload.merged_at,
				'closed-at': payload.closed_at,
			},
			relationships: {
				repo: {
					data: {
						type: 'repository',
						id: payload.base.repo.full_name,
					}
				},
				author: {
					data: {
						type: 'user',
						id: user.login,
					}
				},
				reviews: {
					links: {
						related: trimHost(payload.url) + '/reviews?per_page=100',
					}
				},
				'issue-comments': {
					links: {
						related: trimHost(payload.comments_url) + '?per_page=100',
					}
				},
				'review-comments': {
					links: {
						related: trimHost(payload.review_comments_url) + '?per_page=100',
					}
				}
			}
		};
	},
});
