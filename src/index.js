const core = require('@actions/core');
const github = require('@actions/github')

const run = async () => {
  const token = core.getInput('token');

  const octokit = new github.getOctokit(token)

  try {
    const repo = github.context.repo
    console.log(`repo: ${JSON.stringify(repo)}`)
    console.log(`sha: ${github.context.sha}`)
    const commit = await octokit.rest.git.getCommit({
      owner: repo.owner,
      repo: repo.repo,
      commit_sha: github.context.sha
    })
    console.log(`commit: ${JSON.stringify(commit, undefined, 2)}`);
    core.setOutput('content', 'payload')
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()