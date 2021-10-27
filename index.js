// const releaseDrafter = require("release-drafter-github-app");

module.exports = (app) => {
    app.log.info("Yay, the app was loaded!");
    // releaseDrafter(app,{})

    // app.on("milestone.closed", async (context) => {
    //     await releaseDrafter.apply()
    //     const issueComment = context.issue({
    //         body: "Thanks for opening this issue!",
    //     });
    //     return context.octokit.issues.createComment(issueComment);
    // });

    // For more information on building apps:
    // https://probot.github.io/docs/

    // To get your app running against GitHub, see:
    // https://probot.github.io/docs/development/
};
