module.exports.welcome = app => {

    app.on("issues.opened", async (context) => {
        return context.octokit.issues.createComment(
            context.issue({ body: "Thanks for opening your first issue here! Be sure to follow the issue template!" })
        );
    });

    app.on("pull_request.opened", async (context) => {
        return context.octokit.issues.createComment(
            context.issue({ body: "Thanks for opening this pull request! Please check out our contributing guidelines." })
        );
    });

}
