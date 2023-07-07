
module.exports = app => {
    const messageController = require('../controllers/message.controller')
    var router = require("express").Router();
    const db = require('../models')
    const Message = db.message

    //router.get('/',messageController.getMessage)
    router.post('/:senderId/:receiverId', messageController.postMessage)
    
    router.get('/',messageController.getAllMessages)

    router.get('/chatMessages/:senderId/:receiverId',messageController.getChatMessages)
    
    app.use('/api/test/message', router);
}