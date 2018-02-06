import DS from 'ember-data';
import ENV from 'github-dashboard/config/environment';
import {trimHost} from 'github-dashboard/helpers/github';

export default DS.JSONAPISerializer.extend({

	normalizeFindHasManyResponse(store, primaryModelClass, payload, id, requestType){
		let jsonPayload = {
			data: payload.map(this.doNormalize)
		};
		return this._super(store, primaryModelClass, jsonPayload, id, requestType);
	},

	doNormalize(payload) {
		let normalized = {
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
						related: trimHost(payload.url) + '/pulls?per_page=100&sort=updated&direction=desc'
					}
				},
			}
		};

		let numMergedPulls = ENV.NUM_MERGED_PULLS['default'];
		if (ENV.NUM_MERGED_PULLS[payload.name]) {
			numMergedPulls = ENV.NUM_MERGED_PULLS[payload.name];
		}

		let mergedPullsUrl = trimHost(payload.url) + '/pulls?state=closed&sort=updated&direction=desc';
		mergedPullsUrl += '&per_page=' + numMergedPulls;

		normalized.relationships['merged-pulls'] = {
			links: {
				related: mergedPullsUrl
			}
		};

		return normalized;
	}
});
