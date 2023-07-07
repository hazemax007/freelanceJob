module.exports = app => {
    const applicationController = require('../controllers/application.controller')
    var router = require("express").Router();
    var multer = require('multer');

    const storage = multer.diskStorage({
    destination:'uploads',
    filename:(req,file,cb) => {
        cb(null,file.originalname)}})

    const upload = multer({
    storage:storage})

    //router.post('/uploadResume', applicationController.uploadResume)

    router.post('/:userId/:projectId',upload.single("resume"), applicationController.addApplication)
    router.get("/",applicationController.getAllApplications)
    router.get('/:id',applicationController.getApplicationById)
    router.delete('/:id',applicationController.deleteApplication)
    router.post('/sendEmail',applicationController.sendDecision)
    //router.get('/getResume/:filepath',applicationController.getResume)

    app.use('/api/test/applications', router);
}

