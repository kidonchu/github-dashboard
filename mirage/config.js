import users from '../mirage/apidata/get_users';
import org from '../mirage/apidata/get_organization';
import repos from '../mirage/apidata/get_repos';
import pulls from '../mirage/apidata/get_pulls';
import reviews from '../mirage/apidata/get_reviews';
import comments from '../mirage/apidata/get_comments';
import createComment from '../mirage/apidata/create_comment';

export default function() {
	this.logging = false;
	this.urlPrefix = 'https://api.github.com';

	this.get('/users/:username', (db, request) => {
		let username = request.params.username;
		return users.find(function(user) {
			return user.login === username;
		});
	});

	this.get('/repos/kidonchu/:repo/pulls', (db, request) => {
		let repo = request.params.repo;
		return pulls.filter(function(p) {
			return p.base.repo.name === repo;
		});
	});

	this.get('/repos/kidonchu/:repo/pulls/:pullId', (db, request) => {
		let pullId = parseInt(request.params.pullId, 10);
		let pull = pulls.find((pull) =>  {
			return pull.number === pullId;
		});
		pull.updated_at = (new Date()).toISOString();
		return pull;
	});

	this.get('/repos/kidonchu/:repo/pulls/:pullId/reviews', (db, request) => {
		let repo = request.params.repo;
		let pullId = request.params.pullId;
		let re = new RegExp(repo + "\/pulls\/" + pullId);
		return reviews.filter(function(r) {
			return re.test(r.pull_request_url);
		});
	});

	this.get('/repos/kidonchu/:repo/issues/:issueId/comments', (db, request) => {
		let repo = request.params.repo;
		let issueId = request.params.issueId;
		let re = new RegExp(repo + "\/issues\/" + issueId);
		return comments.filter(function(r) {
			return re.test(r.issue_url);
		});
	});

	this.get('/orgs/kidonchu/repos', () => {
		return repos;
	});

	this.get('/repos/kidonchu/:repo', (db, request) => {
		let repo = request.params.repo;
		return repos.find(function(r) {
			return r.name === repo;
		});
	});

	this.get('/orgs/:organization', () => {
		return org;
	});

	this.post('/repos/kidonchu/:repo/issues/:issueId/comments', (db, request) => {
		let repo = request.params.repo;
		let issueId = request.params.issueId;
		let comment = JSON.parse(request.requestBody);
		return createComment(repo, issueId, comment.body);
	});
}
