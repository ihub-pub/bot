module.exports.welcome = app => {

    app.on("issues.opened", async (context) => {
        return context.octokit.issues.createComment(
            context.issue({ body: "Thanks for opening your first issue here! Be sure to follow the issue template!" })
        );
    });

}
