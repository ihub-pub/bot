const {checkMilestone} = require("./lib/check-milestone")
const {getVersionInfo} = require('release-drafter-github-app/lib/versions')

module.exports = app => {
    app.log.info("Yay, the app was loaded!")

    checkMilestone(app)

    app.on("milestone.closed", async context => {
        // 自动创建下一个里程碑
        await context.octokit.rest.issues.createMilestone({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            title: getVersionInfo(context.payload.milestone.title, null).$RESOLVED_VERSION.version
        })
    });

}
