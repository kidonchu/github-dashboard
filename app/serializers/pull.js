import DS from 'ember-data';

function trimHost(str) {
	return str.replace('https://api.github.com', '');
}

export default DS.JSONAPISerializer.extend({

	normalizeResponse(store, primaryModelClass, payload, id, requestType) {

		let repo = payload.base.repo;
		let user = payload.user;

		let jsonPayload = {
			data: {
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
			}
		};

		return this._super(store, primaryModelClass, jsonPayload, id, requestType);
	},

});
