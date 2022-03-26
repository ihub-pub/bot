module.exports.updateChangelog = (app) => {

    app.on("milestone.closed", async context => {
        if (context.payload.sender.type === "Bot") {
            // 自动更新变更记录
            await createOrUpdateFileContents(context, "docs/CHANGELOG.md", lastChanges, true)

            // 更新文档版本号
            await createOrUpdateFileContents(context, "docs/js/version.js",
                () => `const version = '${context.payload.milestone.title}'`, false)
        }
    });

}

async function createOrUpdateFileContents(context, path, addContent, create) {
    let content = null
    try {
        content = await context.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: context.payload.repository.owner.login,
            repo: context.payload.repository.name,
            path: path
        })
    } catch (err) {
        context.log.info(`Not found ${path}`)
    }
    if (!create && content == null) {
        return
    }

    const oldContent = content == null ? "" : Buffer.from(content.data.content, "base64").toString("utf-8")

    const newContent = await addContent(context, oldContent)

    await context.octokit.rest.repos.createOrUpdateFileContents({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
        path: path,
        message: `release: ${context.payload.milestone.title}`,
        content: Buffer.from(newContent, "utf-8").toString("base64"),
        sha: content == null ? null : content.data.sha
    })
}

async function lastChanges(context, oldContent) {
    const lastRelease = (await context.octokit.rest.repos.getLatestRelease({
        owner: context.payload.repository.owner.login,
        repo: context.payload.repository.name,
    })).data
    const changes = lastRelease.body.replace(/##/g, "###").replace(/@([A-Za-z0-9_-]+) \(#(\d+)\)/g,
        ` [@$1](https://github.com/$1) ([#$2](${context.payload.repository.html_url}/pull/$2))`)
    return `## ${lastRelease.name} (${lastRelease.published_at.substring(0, 10)})

${changes}

---

${oldContent}`
}
