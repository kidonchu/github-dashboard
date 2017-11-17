import ENV from 'github-dashboard/config/environment';
export default {
	login: `${ENV.ORGANIZATION}`,
	avatar_url: "https://avatars1.githubusercontent.com/u/1875398?v=3",
	members_url: `https://api.github.com/orgs/${ENV.ORGANIZATION}/members{/member}`,
	repos_url: `https://api.github.com/orgs/${ENV.ORGANIZATION}/repos`,
	name: `${ENV.ORGANIZATION}`,
};
