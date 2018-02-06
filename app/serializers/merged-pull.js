import DS from 'ember-data';

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
			type: 'merged-pull',
			attributes: {
				number: payload.number,
				title: payload.title,
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
			}
		};
	},
});
