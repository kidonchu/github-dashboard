import ENV from './../config/environment';

export function initialize(appInstance) {
  let githubSession = appInstance.lookup('service:github-session');

  githubSession.set('githubAccessToken', ENV.GITHUB_ACCESS_TOKEN);
}

export default {
  name: 'github-session-token',
  initialize
};
