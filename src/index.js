const core = require('@actions/core');
const github = require('@actions/github')

const token = core.getInput('token');

const octokit = new github.getOctokit(token)

try {
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
  const repo = github.context.repo
  const commit = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
    owner: repo.owner,
    repo: repo.repo,
    ref: github.context.ref,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  console.log(`commit: ${JSON.stringify(commit, undefined, 2)}`);
  core.setOutput('content', payload)
} catch (error) {
  core.setFailed(error.message);
}