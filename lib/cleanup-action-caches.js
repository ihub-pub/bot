module.exports.cleanupCaches = app => {

    app.on("pull_request.closed", async context => {
        let branch = "refs/pull/" + context.event.pull_request.number + "/merge"
        context.log.info(`cleanup caches for ${branch}`)
        let content = await context.octokit.request('GET /repos/{owner}/{repo}/actions/caches?ref={branch}', {
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            branch: branch,
        })
        context.log.info(content.data)
        if (content.data.total_count > 0) {
            content.data.actions_caches.forEach(async cache => {
                await context.octokit.request('DELETE /repos/{owner}/{repo}/actions/caches?key={key}', {
                    owner: context.payload.repository.owner.login,
                    repo: context.payload.repository.name,
                    key: cache.key,
                })
            })
        }
    });

}
