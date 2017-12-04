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
		return {
			id: payload.full_name,
			type: 'repository',
			attributes: {
				'full-name': payload.full_name,
				name: payload.name,
				'html-url': payload.html_url,
			},
			relationships: {
				pulls: {
					links: {
						related: trimHost(payload.url) + '/pulls'
					}
				},
			}
		};
	}
});
