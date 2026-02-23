import {welcome} from "./lib/welcome.js"
import {checkMilestone} from "./lib/check-milestone.js"
import {autoReview, autoMerge} from "./lib/auto-merge.js"
import {autoMilestone} from "./lib/auto-milestone.js"
import {workflowRunRetry} from "./lib/workflow_run-retry.js"
import {cleanupCaches} from "./lib/cleanup-action-caches.js"

export default app => {
    app.log.info("Yay, the app was loaded!")

    welcome(app)

    checkMilestone(app)

    autoMilestone(app)

    autoReview(app)
    autoMerge(app)

    cleanupCaches(app)

    workflowRunRetry(app)

}
