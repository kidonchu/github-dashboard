import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

	normalizeFindHasManyResponse(store, primaryModelClass, payload, id, requestType){
		let jsonPayload = {
			data: payload.map(this.doNormalize)
		};
		return this._super(store, primaryModelClass, jsonPayload, id, requestType);
	},

	doNormalize(payload) {

		return {
			id: payload.id,
			type: 'status',
			attributes: {
				state: payload.state,
				context: payload.context,
				'updated-at': payload.updated_at,
			}
		};
	},
});
