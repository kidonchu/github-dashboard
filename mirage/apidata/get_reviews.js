import ENV from 'github-dashboard/config/environment';
export default [
	{
		body: "",
		id: 1,
		pull_request_url: `https://api.github.com/repos/${ENV.ORGANIZATION}/gitcli/pulls/1234`,
		state: "APPROVED",
		submitted_at: "2017--13T13:23:26Z",
		user: {
			url: "https://api.github.com/users/kidonchu"
		}
	},
	{
		body: "Looks good! except few things...",
		id: 2,
		pull_request_url: `https://api.github.com/repos/${ENV.ORGANIZATION}/github-dashboard/pulls/2345`,
		state: "CHANGES_REQUESTED",
		submitted_at: "2017-09-13T13:23:26Z",
		user: {
			url: "https://api.github.com/users/kidonchu"
		}
	},
	{
		body: "I left some comments for you",
		id: 3,
		pull_request_url: `https://api.github.com/repos/${ENV.ORGANIZATION}/github-dashboard/pulls/3456`,
		state: "COMMENTED",
		submitted_at: "2017-10-13T13:23:26Z",
		user: {
			url: "https://api.github.com/users/kidonchu"
		}
	}
];
