const { authJwt } = require("../middlewares");
module.exports = app => {
    const projects = require("../controllers/project.controller");

    const storage = require('../middlewares/storage');
  
    var router = require("express").Router();
  
    // Create a new Project
    router.post("/", projects.create);
  
    // Retrieve all Projects
    router.get("/", projects.findAll);
  
    // Retrieve all published Projects
    router.get("/published", projects.findAllPublished);
  
    // Retrieve a single Project with id
    router.get("/:id", projects.findOne);
  
    // Update a Project with id
    router.put("/:id", projects.update);
  
    // Delete a Project with id
    router.delete("/:id", projects.delete);

    // Delete all Projects
    router.delete("/", projects.deleteAll);

    router.post('/assignProject/:projectId/:userId',projects.assignProject)

    router.post('/match', projects.projectMatching)

    app.use('/api/test/projects', router);
};