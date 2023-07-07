module.exports = app => {
    const resumeController = require('../controllers/resume.controller')
    var router = require("express").Router();
    var multer = require('multer')

    const upload = multer();

    
    router.get('/flaskTest',resumeController.testFlaskServer)

    router.get('/',resumeController.getAllResumes)

    router.get('/:id',resumeController.getResumeById)

    router.post("/:userId/:projectId" ,upload.single('resume'),resumeController.resumeParser)

    router.delete("/:id",resumeController.deleteResume)


    app.use('/api/test/resume', router);
}