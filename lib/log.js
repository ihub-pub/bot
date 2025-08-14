export function log({context, message, error}) {
    const repo = context.payload.repository
    const prefix = repo ? `${repo.full_name}: ` : ''
    const logString = `${prefix}${message}`
    if (error) {
        context.log.warn(error, logString)
    } else {
        context.log.info(logString)
    }
}

export function info(context, message) {
    log({context, message})
}

export function warn(context, message) {
    log({context, error: message})
}
