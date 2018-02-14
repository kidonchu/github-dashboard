import DS from 'ember-data';
import {trimHost} from 'github-dashboard/helpers/github';

export default DS.JSONAPISerializer.extend({

	normalizeCreateRecordResponse(store, primaryModelClass, payload, id, requestType) {
		let jsonPayload = {
			data: this.doNormalize(payload)
		};
		return this._super(store, primaryModelClass, jsonPayload, id, requestType);
	},

	normalizeFindHasManyResponse(store, primaryModelClass, payload, id, requestType){
		let jsonPayload = {
			data: payload.map(this.doNormalize)
		};
		return this._super(store, primaryModelClass, jsonPayload, id, requestType);
	},

	doNormalize(payload) {

		let parts = trimHost(payload.issue_url).split('/');
		let repo = parts[3];
		let number = parts[5];

		let jsonPayload = {
			id: payload.id,
			type: 'comment',
			attributes: {
				body: payload.body,
				'created-at': payload.created_at,
				'html-url': payload.html_url,
			},
			relationships: {
				author: {
					data: {
						type: 'user',
						id: payload.user.login,
					}
				},
				pull: {
					data: {
						type: 'pull',
						id: `${repo}:${number}`,
					}
				},
			}
		};

		return jsonPayload;
	},

	serialize() {

		let origJson = this._super(...arguments);
		let newJson = {
			body: origJson.data.attributes.body
		};

		return newJson;
	},
});
