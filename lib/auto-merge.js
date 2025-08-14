import {info} from './log.js'

export function autoReview(app) {

    app.on("pull_request.opened", async context => {
        const pr = context.payload.pull_request
        const owner = pr.base.repo.owner.login
        const repo = pr.base.repo.name
        if (context.payload.sender.type === "Bot") {
            const reviewers = (await context.octokit.rest.pulls.listRequestedReviewers({
                owner: owner,
                repo: repo,
                pull_number: pr.number
            })).data.users
            if (reviewers.length === 0) {
                // 版本升级PR自动设置review
                const response = await context.octokit.rest.pulls.createReview({
                    owner: owner,
                    repo: repo,
                    pull_number: pr.number,
                    event: "APPROVE",
                    body: "IHub Bot: PR is approved by IHub Bot"
                })
                if (response.status === "200") {
                    info(context, `approve PR ${pr.number}`)
                } else {
                    info(context, `approve PR ${pr.number} failed`)
                }
            }
        }
    })

}

export function autoMerge(app) {

    app.on("workflow_run.completed", async context => {
        let requests = context.payload.workflow_run.pull_requests;
        if (requests.length === 0) {
            const repo = context.payload.repository;
            for (const pr of (await context.octokit.rest.pulls.list({
                owner: repo.owner.login,
                repo: repo.name,
                state: "open"
            })).data) {
                await mergePr(context, pr)
            }
        } else {
            const repo = context.payload.repository;
            for (const r of requests) {
                info(context, `merge PR ${r.number}`)
                const pr = (await context.octokit.rest.pulls.get({
                    owner: repo.owner.login,
                    repo: repo.name,
                    pull_number: r.number
                })).data
                await mergePr(context, pr)
            }
        }
    })
}

async function mergePr(context, pr) {
    const owner = pr.base.repo.owner.login
    const repo = pr.base.repo.name
    if (pr.state === "open" && pr.merged === false && pr.mergeable === true && context.payload.sender.type === "Bot") {
        const response = await context.octokit.rest.pulls.merge({
            owner: owner,
            repo: repo,
            pull_number: pr.number,
            merge_method: "squash",
            commit_message: "IHub Bot: PR is merged by IHub Bot"
        })
        if (response.status === "200") {
            info(context, `merge PR ${pr.number}`)
        } else {
            info(context, `merge PR ${pr.number} failed, ${response.data.message}`)
        }
    }
}
