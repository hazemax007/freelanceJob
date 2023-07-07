module.exports = app => {
    const userController = require('../controllers/user.controller')
    var router = require("express").Router();

    
    router.get("/userCharts",userController.userChatsData)

    app.use('/api/test/admin', router);
}