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
				state: payload.state,
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
						related: trimHost(payload.url) + '/reviews',
					}
				},
				'issue-comments': {
					links: {
						related: trimHost(payload.comments_url),
					}
				},
				'review-comments': {
					links: {
						related: trimHost(payload.review_comments_url),
					}
				}
			}
		};
	},
});
