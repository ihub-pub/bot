const {welcome} = require("./lib/welcome")
const {checkMilestone} = require("./lib/check-milestone")
const {autoMilestone} = require("./lib/auto-milestone")
const {updateChangelog} = require("./lib/update-changelog")
const {workflowRunRetry} = require("./lib/workflow_run-retry")

module.exports = app => {
    app.log.info("Yay, the app was loaded!")

    welcome(app)

    checkMilestone(app)

    autoMilestone(app)

    // updateChangelog(app)

    workflowRunRetry(app)

    require("release-drafter-github-app")(app, {})

}
