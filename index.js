const {createPullRequestStatus} = require("./lib/check-milestone")

module.exports = app => {
    app.log.info("Yay, the app was loaded!");

    app.on("milestone.closed", async context => {
        // TODO 自动发布release,创建下一个里程碑
        app.log.info("release.published");
    });

    app.on("pull_request", async context => {
        app.log.info("Received pull_request webhook")
        createPullRequestStatus(context, context.payload.pull_request)
    })

    app.on("issues", async context => {
        app.log.info("Received issue webhook")

        const issueParams = {
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            number: context.payload.issue.number
        }

        // Get issue
        const issue = await context.octokit.issues.get(issueParams)

        if (issue.data.pull_request != null) {
            app.log.info("Issue is a PR")
            // It is a PR, so we need to get the PR
            const pr = await context.octokit.pullRequests.get(issueParams)
            createPullRequestStatus(context, pr.data)
        } else {
            app.log.info("Issue is not a PR!")
        }
    })

}
