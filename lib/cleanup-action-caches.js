const {info} = require('./log')

module.exports.cleanupCaches = app => {

    app.on("pull_request.closed", async context => {
        let content = await context.octokit.request('GET /repos/{owner}/{repo}/actions/caches?ref={branch}', {
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            branch: `refs/pull/${context.payload.pull_request.number}/merge`,
        })
        if (content.data.total_count > 0) {
            content.data.actions_caches.forEach(async cache => {
                await context.octokit.request('DELETE /repos/{owner}/{repo}/actions/caches?key={key}', {
                    owner: context.payload.repository.owner.login,
                    repo: context.payload.repository.name,
                    key: cache.key,
                })
            })
            info(context, `Delete ${content.data.total_count} caches`)
        } else {
            info(context, `No caches`)
        }
    });

}
