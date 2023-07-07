module.exports = app => {
    const { authJwt } = require("../middlewares");
    const userController = require("../controllers/user.controller");
    const multer = require('multer');
    var router = require("express").Router();

  
    // Retrieve all Projects
    router.get("/" , userController.getAllUsers);
  
    // Retrieve a single Project with id
    router.get("/:id" , userController.getUserById);
  
    // Update a Project with id
    router.put("/:id", userController.updateUser);
  
    // Delete a Project with id
    router.delete("/:id" , userController.deleteUser);

    //router.post("/upload",upload.single('profileImage'),userController.uploadImage)

    //router.get("/retrieve/:id",userController.retrieveImage)

    router.post("/intercontrat/:id",userController.defineIntercontrat)

    router.get("/intercontrat/getAll", userController.getAllIntercontrats)

    router.get('/getIntercontrat/:id',userController.getIntercontratById)

    router.delete('/deleteIntercontrat/:id', userController.defineIntercontrat)

    router.get('/fetchUsers/:connectedUserId', userController.fetchUsers)

    app.use('/api/test/users', router);
};