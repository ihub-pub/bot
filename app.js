const {welcome} = require("./lib/welcome")
const {checkMilestone} = require("./lib/check-milestone")
const {autoMilestone} = require("./lib/auto-milestone")
const {updateChangelog} = require("./lib/update-changelog")
const {workflowRunRetry} = require("./lib/workflow_run-retry")

module.exports = app => {
    app.log.info("Yay, the app was loaded!")

    welcome(app)

    // vercel部署后检查状态总是存在延时，导致状态错误，暂时关闭
    // checkMilestone(app)

    autoMilestone(app)

    // updateChangelog(app)

    workflowRunRetry(app)

    require("release-drafter-github-app")(app, {})

}
