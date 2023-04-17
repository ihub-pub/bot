module.exports.workflowRunRetry = app => {

    app.on("workflow_run.completed", async context => {
        const run = context.payload.workflow_run
        // 定时任务或者发布任务工作流失败时重试，最多重试4次
        if ((run.event === "schedule" || run.event === "release") && run.conclusion === "failure" && run.run_attempt < 5) {
            app.log.info("Rerun Workflow Run")
            await context.octokit.request('POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun', {
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                run_id: run.id
            })
        }
    });

}
