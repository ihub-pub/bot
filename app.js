const {welcome} = require("./lib/welcome")
const {checkMilestone} = require("./lib/check-milestone")
const {autoReview, autoMerge} = require("./lib/auto-merge")
const {autoMilestone} = require("./lib/auto-milestone")
const {updateChangelog} = require("./lib/update-changelog")
const {workflowRunRetry} = require("./lib/workflow_run-retry")
const {cleanupCaches} = require("./lib/cleanup-action-caches")

module.exports = (app, options) => {
    app.log.info("Yay, the app was loaded!")

    welcome(app)

    checkMilestone(app)

    autoMilestone(app)

    autoReview(app)
    autoMerge(app)

    // updateChangelog(app)

    cleanupCaches(app)

    workflowRunRetry(app)

    require("release-drafter-github-app")(app, {})

}
