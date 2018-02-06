import Ember from 'ember';

export function trimHost(str) {
	return str.replace('https://api.github.com', '');
}
