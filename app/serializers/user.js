import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

	normalizeResponse(store, primaryModelClass, payload, id, requestType) {

		let jsonPayload = {
			data: {
				id: payload.login,
				type: 'user',
				attributes: {
					login: payload.login,
					name: payload.name,
					'avatar-url': payload.avatar_url
				}
			}
		};

		return this._super(store, primaryModelClass, jsonPayload, id, requestType);
	},

});
