import ENV from 'github-dashboard/config/environment';
export default function createComment(repo, issueId, comment) {
	let now = new Date();
	return {
		id: Math.floor(Math.random() * 1948295),
		body: comment,
		created_at: `2017-${now.getMonth()+1}-${("0" + now.getDate()).substr(-2, 2)}T20:13:46Z`,
		html_url: `https://github.com/${ENV.ORGANIZATION}/${repo}/pull/${issueId}`,
		issue_url: `https://api.github.com/repos/${ENV.ORGANIZATION}/${repo}/issues/${issueId}`,
		user: {
			login: "kidonchu"
		},
	};
}
