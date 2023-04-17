const {getVersionInfo} = require("release-drafter-github-app/lib/versions")

module.exports.autoMilestone = app => {

    app.on("release.published", async context => {
        // 发布release自动关闭里程碑
        const milestones = (await context.octokit.rest.issues.listMilestones({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            state: "open"
        })).data.filter(m => m.title === context.payload.release.tag_name)
        if (milestones.length === 1) {
            await context.octokit.rest.issues.updateMilestone({
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                milestone_number: milestones[0].number,
                state: "closed"
            })
        }
    });

    app.on("milestone.closed", async context => {
        // 里程碑关闭自动创建下一个里程碑
        await context.octokit.rest.issues.createMilestone({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            title: getVersionInfo(context.payload.milestone.title, null).$RESOLVED_VERSION.version
        })
    });

}
