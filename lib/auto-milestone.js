const {getVersionInfo} = require("release-drafter-github-app/lib/versions")
const {info} = require('./log')

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
            info(context, `close milestone ${milestones[0].title}`)
        }
    });

    app.on("milestone.closed", async context => {
        // 里程碑关闭自动创建下一个里程碑
        let title = getVersionInfo(context.payload.milestone.title, null).$RESOLVED_VERSION.version
        await context.octokit.rest.issues.createMilestone({
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            title: title
        })
        info(context, `create milestone ${title}`)
    });

    app.on("pull_request", async context => {
        // PR自动设置里程碑
        const pr = context.payload.pull_request
        const owner = pr.base.repo.owner.login
        const repo = pr.base.repo.name
        const milestone = (await context.octokit.rest.issues.listMilestones({
            owner: owner,
            repo: repo,
            state: "open"
        })).data.filter(m => new RegExp('\d+(.\d+)*').test(m.title))
        if (milestone.length === 1 && pr.milestone == null) {
            await context.octokit.rest.issues.update({
                owner: owner,
                repo: repo,
                issue_number: pr.number,
                milestone: milestone[0].number
            })
            info(context, `set milestone ${milestone[0].title} for PR ${pr.number}`)
        }
    })

}
