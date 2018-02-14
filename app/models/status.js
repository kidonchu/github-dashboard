import DS from 'ember-data';
import Ember from 'ember';

const { computed } = Ember;

export default DS.Model.extend({
	state: DS.attr('string'),
	context: DS.attr('string'),
	updatedAt: DS.attr('date'),

	isSuccess: computed('state', function() {
		return this.get('state') === 'success';
	}),

	isPending: computed('state', function() {
		return this.get('state') === 'pending';
	}),

	isFailure: computed('state', function() {
		return this.get('state') === 'failure';
	}),
});
