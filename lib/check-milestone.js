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

function createPullRequestStatus(context, pr) {
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

module.exports.checkMilestone = (app) => {
    app.log.info("Yay, the checkMilestone was loaded!")
    app.on("pull_request", async context => {
        app.log.info("Received pull_request webhook")
        createPullRequestStatus(context, context.payload.pull_request)
    })

    app.on("issues", async context => {
        app.log.info("Received issue webhook")
        if (context.payload.issue.pull_request != null) {
            app.log.info("Issue is a PR")
            const pr = await context.octokit.pulls.get({
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                pull_number: context.payload.issue.number
            })
            createPullRequestStatus(context, pr.data)
        } else {
            app.log.info("Issue is not a PR!")
        }
    })

}
