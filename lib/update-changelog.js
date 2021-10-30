const path = "CHANGELOG.md"
const {getConfig} = require("release-drafter-github-app/lib/config")
const {findCommitsWithAssociatedPullRequests} = require("release-drafter-github-app/lib/commits")
const {sortPullRequests} = require("release-drafter-github-app/lib/sort-pull-requests")
const {generateChangeLog} = require("release-drafter-github-app/lib/releases")

module.exports.updateChangelog = (app) => {

    app.on("milestone.closed", async context => {
        if (context.payload.sender.type === "User") {
            let content = null
            try {
                content = await context.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                    owner: context.payload.repository.owner.login,
                    repo: context.payload.repository.name,
                    path: path
                })
            } catch (err) {
                app.log.info("Not found CHANGELOG.md")
            }
            const changelog = content == null ? "" : Buffer.from(content.data.content, "base64").toString("utf-8")

            const changes = (await lastChanges(context)) + changelog

            await context.octokit.rest.repos.createOrUpdateFileContents({
                owner: context.payload.repository.owner.login,
                repo: context.payload.repository.name,
                path: path,
                message: `🔖 release ${context.payload.milestone.title}`,
                content: Buffer.from(changes, "utf-8").toString("base64"),
                sha: content == null ? null : content.data.sha
            })
        }
    });

}

async function lastChanges(context) {
    const config = await getConfig({context})
    const ref = context.payload.repository.default_branch
    const {pullRequests: mergedPullRequests} = await findCommitsWithAssociatedPullRequests({context, ref, config})
    const changes = generateChangeLog(
        sortPullRequests(mergedPullRequests, config['sort-by'], config['sort-direction']), config
    ).replace(/##/g, "###").replace(/ @(.+) \(#(\d+)\)/g,
        ` [@$1](https://github.com/$1) ([#$2](${context.payload.repository.html_url}/pull/$2))`)
    const name = config['name-template'].replace("$RESOLVED_VERSION", context.payload.milestone.title)
    return `## ${name} (${context.payload.milestone.closed_at.substring(0, 10)})

${changes}

---

`
}
