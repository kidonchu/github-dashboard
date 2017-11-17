import DS from 'ember-data';
import Ember from 'ember';

const { computed } = Ember;

export default DS.Model.extend({
	body: DS.attr('string'),
	state: DS.attr('string'),
	submittedAt: DS.attr('date'),
	author: DS.belongsTo('user', {async:true}),

	fullBody: computed('state', 'body', function() {
		switch(this.get('state')) {
			case 'commented':
				if(this.get('body')) {
					return Ember.String.htmlSafe(
						`<span class="orange bold">reviewed.</span> ${this.get('body')}`
					);
				}
				return '';
			case 'approved':
				return Ember.String.htmlSafe(
					`<span class="green bold">approved.</span> ${this.get('body')}`
				);
			case 'changes_requested':
				return Ember.String.htmlSafe(
					`<span class="red bold">requested changes.</span> ${this.get('body')}`
				);
		}
		return '';
	}),

	hasBody: computed.notEmpty('fullBody'),
});
