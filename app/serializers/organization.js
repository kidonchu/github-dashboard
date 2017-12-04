import DS from 'ember-data';

function trimHost(str) {
	return str.replace('https://api.github.com', '');
}

export default DS.JSONAPISerializer.extend({

	normalizeResponse(store, primaryModelClass, payload, id, requestType) {

		let jsonPayload = {
			data: this.doNormalize(payload)
		};

		return this._super(store, primaryModelClass, jsonPayload, id, requestType);
	},

	doNormalize(payload) {
		return {
			id: payload.login,
			type: 'organization',
			attributes: {
				login: payload.login,
				name: payload.name,
			},
			relationships: {
				repos: {
					links: {
						related: trimHost(payload.repos_url)
					}
				},
			}
		};
	}
});
