export default function createComment(repo, issueId, comment) {
	let now = new Date();
	return {
		body: comment,
		created_at: `2017-${now.getMonth()+1}-${now.getDate()}T20:13:46Z`,
		id: Math.floor(Math.random() * 1948295),
		issue_url: `https://api.github.com/repos/kidonchu/${repo}/issues/${issueId}`,
		user: {
			url: "https://api.github.com/users/kidonchu"
		}
	};
}
