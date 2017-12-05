import Ember from 'ember';
import DS from 'ember-data';

const { computed } = Ember;

export default DS.Model.extend({
	body: DS.attr('string'),
	state: DS.attr('string'),
	submittedAt: DS.attr('date'),

	author: DS.belongsTo('user', {async:true}),

	authorLogin: computed.alias('author.login'),
	authorName: computed.alias('author.name'),

	fullBody: computed('state', 'body', function() {
		switch(this.get('state')) {
			case 'approved':
				return Ember.String.htmlSafe(
					`<span class="green bold">approved.</span> ${this.get('body')}`
				);
			case 'changes_requested':
				return Ember.String.htmlSafe(
					`<span class="red bold">requested changes.</span> ${this.get('body')}`
				);
			case 'commented':
				return Ember.String.htmlSafe(
					`<span class="orange bold">reviewed.</span> ${this.get('body')}`
				);
			default:
				return Ember.String.htmlSafe(
					`<span class="bold">unknown state.</span> ${this.get('body')}`
				);
		}
		return '';
	}),
});
