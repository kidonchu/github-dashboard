import ENV from 'github-dashboard/config/environment';
export default [
	{
		"id": 1,
		"name": "github-dashboard",
		"full_name": `${ENV.ORGANIZATION}/github-dashboard`,
		"owner": {
			"url": "https://api.github.com/users/kidonchu",
		},
		"description": "Github Dashboard built with Ember",
		"html_url": `https://github.com/${ENV.ORGANIZATION}/github-dashboard`,
		"language": "JavaScript",
		"private": false,
		"fork": false,
		"created_at": "2017-11-16T18:48:15Z",
		"updated_at": "2017-11-16T19:02:34Z",
		"pushed_at": "2017-11-17T01:04:39Z",
		"url": `https://api.github.com/repos/${ENV.ORGANIZATION}/github-dashboard`,
		"default_branch": "master"
	},
	{
		"id": 2,
		"name": "gitcli",
		"full_name": `${ENV.ORGANIZATION}/gitcli`,
		"owner": {
			"url": "https://api.github.com/users/kidonchu",
		},
		"description": "make your life easier working with stories through git CLI",
		"html_url": `https://github.com/${ENV.ORGANIZATION}/gitcli`,
		"language": "Shell",
		"private": false,
		"fork": false,
		"created_at": "2017-04-21T22:16:53Z",
		"updated_at": "2017-05-07T01:40:16Z",
		"pushed_at": "2017-10-14T04:49:07Z",
		"url": `https://api.github.com/repos/${ENV.ORGANIZATION}/gitcli`,
		"default_branch": "master"
	}
];
