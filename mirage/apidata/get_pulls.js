import ENV from 'github-dashboard/config/environment';
export default [
	{
		assignee: {
			url: "https://api.github.com/users/kidonchu"
		},
		base: {
			repo: {
				name: "gitcli",
				url: `https://api.github.com/repos/${ENV.ORGANIZATION}/gitcli`,
			}
		},
		body: "",
		closed_at: null,
		comments_url: `https://api.github.com/repos/${ENV.ORGANIZATION}/gitcli/issues/1234/comments`,
		created_at: "2017-06-12T21:53:37Z",
		html_url: `https://github.com/${ENV.ORGANIZATION}/gitcli/pull/1234`,
		id: 1,
		merged_at: null,
		number: 1234,
		state: "open",
		title: "Make gitcli as the greatest git tool ever",
		updated_at: "2017-06-13T13:23:26Z",
		url: `https://api.github.com/repos/${ENV.ORGANIZATION}/gitcli/pulls/1234`,
		user: {
			avatar_url: "https://avatars1.githubusercontent.com/u/1875398?v=3",
			"login": "kidonchu",
			"url": "https://api.github.com/users/kidonchu"
		}
	},
	{
		assignee: {
			url: "https://api.github.com/users/kidonchu"
		},
		base: {
			repo: {
				name: "github-dashboard",
				url: `https://api.github.com/repos/${ENV.ORGANIZATION}/github-dashboard`,
			}
		},
		body: "",
		closed_at: null,
		comments_url: `https://api.github.com/repos/${ENV.ORGANIZATION}/github-dashboard/issues/2345/comments`,
		created_at: "2017-09-15T21:53:37Z",
		html_url: `https://github.com/${ENV.ORGANIZATION}/github-dashboard/pull/2345`,
		id: 2,
		merged_at: null,
		number: 2345,
		state: "open",
		title: "I'm going to make him an offer he can't refuse",
		updated_at: "2017-09-16T13:23:26Z",
		url: `https://api.github.com/repos/${ENV.ORGANIZATION}/github-dashboard/pulls/2345`,
		user: {
			avatar_url: "https://avatars1.githubusercontent.com/u/1875398?v=3",
			"login": "kidonchu",
			"url": "https://api.github.com/users/kidonchu"
		}
	},
	{
		assignee: {
			url: "https://api.github.com/users/kidonchu"
		},
		base: {
			repo: {
				name: "github-dashboard",
				url: `https://api.github.com/repos/${ENV.ORGANIZATION}/github-dashboard`,
			}
		},
		body: "",
		closed_at: null,
		comments_url: `https://api.github.com/repos/${ENV.ORGANIZATION}/github-dashboard/issues/3456/comments`,
		created_at: "2017-11-15T21:53:37Z",
		html_url: `https://github.com/${ENV.ORGANIZATION}/github-dashboard/pull/3456`,
		id: 3,
		merged_at: null,
		number: 3456,
		state: "open",
		title: "May the Force be with you",
		updated_at: "2017-11-16T13:23:26Z",
		url: `https://api.github.com/repos/${ENV.ORGANIZATION}/github-dashboard/pulls/3456`,
		user: {
			avatar_url: "https://avatars1.githubusercontent.com/u/1875398?v=3",
			"login": "kidonchu",
			"url": "https://api.github.com/users/kidonchu"
		}
	}
];
