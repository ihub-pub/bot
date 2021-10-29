const status_context = "Check Milestone"
const failure_state = "pending"
const failure_description = "Please set the milestone!"
const success_state = "success"
const success_description = "Great, the milestone is set."

function createStatus(context, owner, repo, sha, state, desc) {
    return context.octokit.rest.repos.createCommitStatus({
        owner: owner,
        repo: repo,
        sha: sha,
        state: state,
        description: desc,
        context: status_context
    })
}

module.exports.createPullRequestStatus = (context, pr) => {
    const owner = pr.base.repo.owner.login
    const repo = pr.base.repo.name
    const sha = pr.head.sha

    if (pr.milestone == null) {
        context.log.info("No milestone set => failing the status check")
        return createStatus(context, owner, repo, sha, failure_state, failure_description)
    } else {
        context.log.info("Milestone is set => passing the status check")
        return createStatus(context, owner, repo, sha, success_state, success_description)
    }
}
