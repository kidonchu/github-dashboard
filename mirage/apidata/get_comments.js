import ENV from 'github-dashboard/config/environment';
export default [
	{
		body: "This PR looks great!",
		created_at: "2017-11-14T06:43:30Z",
		id: 1,
		issue_url: `https://api.github.com/repos/${ENV.ORGANIZATION}/gitcli/issues/1234`,
		user: {
			url: "https://api.github.com/users/kidonchu"
		}
	},
	{
		body: "How did you come up with this?!",
		created_at: "2017-10-14T06:43:30Z",
		id: 2,
		issue_url: `https://api.github.com/repos/${ENV.ORGANIZATION}/github-dashboard/issues/2345`,
		user: {
			url: "https://api.github.com/users/kidonchu"
		}
	},
];
