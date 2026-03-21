import {info} from './log.js'

function getNextVersion(version) {
    if (!/^\d+(\.\d+)*$/.test(version)) {
        throw new Error(`Invalid version format: ${version}`)
    }
    const parts = version.split('.')
    parts[parts.length - 1] = String(parseInt(parts[parts.length - 1], 10) + 1)
    return parts.join('.')
}

export function autoMilestone(app) {

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
        try {
            let title = getNextVersion(context.payload.milestone.title)
            await context.octokit.rest.issues.createMilestone({
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                title: title
            })
            info(context, `create milestone ${title}`)
        } catch (error) {
            info(context, `skip creating milestone: ${error.message}`)
        }
    });

    app.on("pull_request", async context => {
        const pr = context.payload.pull_request
        const owner = pr.base.repo.owner.login
        const repo = pr.base.repo.name
        if (pr.state === "open") {
            // PR自动设置里程碑
            const milestone = (await context.octokit.rest.issues.listMilestones({
                owner: owner,
                repo: repo,
                state: "open"
            })).data.filter(m => /^\d+(.\d+)*$/.test(m.title) === true)
            if (milestone.length === 1 && pr.milestone == null) {
                await context.octokit.rest.issues.update({
                    owner: owner,
                    repo: repo,
                    issue_number: pr.number,
                    milestone: milestone[0].number
                })
                info(context, `set milestone ${milestone[0].title} for PR ${pr.number}`)
            }
        } else {
            if (!pr.merged) {
                // PR未合并自动清除里程碑
                if (pr.milestone != null) {
                    await context.octokit.rest.issues.update({
                        owner: owner,
                        repo: repo,
                        issue_number: pr.number,
                        milestone: null
                    })
                    info(context, `clear milestone for PR ${pr.number}`)
                }
            }
        }
    })

}
