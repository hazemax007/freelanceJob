const db = require('../models')
const Project = db.project
const Archive = db.archive
const User = db.user

exports.archiveProject = async (req,res) => {
    const {projectId} = req.params
    const {remarque, archiveDate} = req.body

    const project = await Project.findById(projectId)
    try{
        if(!project){
            return res.status(404).json({ message: 'Project not found' });
          }
    
        const archive = new Archive({
            remarque,
            archiveDate,
            project: project._id
        })
    
        await archive.save()
        await project.remove()
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}