import DS from 'ember-data';
import {trimHost} from 'github-dashboard/helpers/github';

export default DS.JSONAPISerializer.extend({

	normalizeFindHasManyResponse(store, primaryModelClass, payload, id, requestType){
		let jsonPayload = {
			data: payload.map(this.doNormalize)
		};
		return this._super(store, primaryModelClass, jsonPayload, id, requestType);
	},

	doNormalize(payload) {

		let parts = trimHost(payload.pull_request_url).split('/');
		let repo = parts[3];
		let number = parts[5];

		let jsonPayload = {
			id: payload.id,
			type: 'review',
			attributes: {
				body: payload.body,
				state: payload.state.toLowerCase(),
				'submitted-at': payload.submitted_at,
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
	}
});
