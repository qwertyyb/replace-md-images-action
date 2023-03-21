const core = require('@actions/core');
const github = require('@actions/github');
const { replaceMdImages } = require('./replace-md-images');

const run = async () => {
  const token = core.getInput('token')
  const secretId = core.getInput('secretId')
  const secretKey = core.getInput('secretKey')
  const bucket = core.getInput('bucket')
  const region = core.getInput('region')
  const prefix = core.getInput('prefix')

  const octokit = new github.getOctokit(token)

  try {
    const repo = github.context.repo
    console.log(`repo: ${JSON.stringify(repo)}`)
    console.log(`sha: ${github.context.sha}`)
    const commit = await octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
      owner: repo.owner,
      repo: repo.repo,
      ref: github.context.ref,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    const mdfiles = commit.files.filter(file => file.status !== 'removed' && file.filename.endsWith('.md')).map(file => file.filename)
    console.log(`markdown files: ${JSON.stringify(mdfiles, undefined, 2)}`);

    const cosOptions = {
      secretId, secretKey, bucket, region, prefix
    }
    const content = await Promise.all(mdfiles.map(async mdfile => {
      const newContent = await replaceMdImages(mdfile, cosOptions)
      return {
        filename: mdfile,
        content: newContent
      }
    }))
    core.setOutput('content', content)
  } catch (error) {
    core.setFailed(error.message);
  }
}

run()