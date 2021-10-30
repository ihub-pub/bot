const {checkMilestone} = require("./lib/check-milestone")
const {autoMilestone} = require("./lib/auto-milestone")

module.exports = app => {
    app.log.info("Yay, the app was loaded!")

    checkMilestone(app)

    autoMilestone(app)

    app.on("workflow_run.completed", async context => {
        const run = context.payload.workflow_run
        // 定时任务工作流失败时重试，最多重试2次
        if (run.event === "schedule" && run.conclusion === "failure" && run.run_attempt < 3) {
            app.log.info("Rerun Workflow Run")
            await context.octokit.request('POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                run_id: run.id
            })
        }
    });

}
