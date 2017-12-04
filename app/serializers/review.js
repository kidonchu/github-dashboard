import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

	normalizeFindHasManyResponse(store, primaryModelClass, payload, id, requestType){
		let jsonPayload = {
			data: payload.map(this.doNormalize)
		};
		return this._super(store, primaryModelClass, jsonPayload, id, requestType);
	},

	doNormalize(payload) {

		let jsonPayload = {
			id: payload.id,
			type: 'review',
			attributes: {
				body: payload.body,
				state: payload.state,
				'submitted-at': payload.submitted_at,
			},
			relationships: {
				author: {
					data: {
						type: 'user',
						id: payload.user.login,
					}
				},
			}
		};

		return jsonPayload;
	}
});
