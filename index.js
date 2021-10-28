module.exports = (app) => {
    app.log.info("Yay, the app was loaded!");

    app.on("milestone.closed", async (context) => {
        // TODO 自动发布release,创建下一个里程碑
        app.log.info("release.published");
    });

};
