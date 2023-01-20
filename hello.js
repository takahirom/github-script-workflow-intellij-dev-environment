const core = require('@actions/core');
const { context, getOctokit } = require('@actions/github');
const { Octokit } = require("@octokit/rest");
let github = new Octokit()

// ----- write your github-script codes here ----

// code example from:
// https://github.com/actions/github-script#welcome-a-first-time-contributor

const creator = context.payload.sender.login
const opts = github.rest.issues.listForRepo.endpoint.merge({
    ...context.issue,
    creator,
    state: 'all'
})
const issues = await github.paginate(opts)

for (const issue of issues) {
    if (issue.number === context.issue.number) {
        continue
    }
    if (issue.pull_request) {
        return // Creator is already a contributor.
    }
}

await github.rest.issues.createComment({
    issue_number: context.issue.number,
    owner: context.repo.owner,
    repo: context.repo.repo,
    body: `**Welcome**, new contributor!

                Please make sure you're read our [contributing guide](CONTRIBUTING.md) and we look forward to reviewing your Pull request shortly ✨`
})