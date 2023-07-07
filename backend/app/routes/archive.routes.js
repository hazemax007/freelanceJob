module.exports = app => {
    const archiveController = require('../controllers/archive.controller')
    var router = require("express").Router();

    
    router.post("/:projectId",archiveController.archiveProject)

    app.use('/api/test/archive', router);
}