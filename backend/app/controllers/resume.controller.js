const axios = require('axios')
const db = require('../models')
const Resume = db.resume
const FormData = require('form-data');
const User = db.user
const Project = db.project


const config = {
  headers: {
    'Content-Type': 'application/json',
  },
}


exports.testFlaskServer = async (req,res) => {
  try{
    const response = await axios.get('http://localhost:5000')
    res.status(200).json({ data: response.data });
  }catch(error){
    console.error('Error launching server:', error);
    res.status(500).json({ error: 'An error occurred while launching the flask server.' });
  }
}


exports.resumeParser = async (req, res) => {
    const { userId } = req.params
    const { projectId } = req.params
    const { description } = req.body
    const pdfFile = req.file.buffer; // Uploaded PDF file
    const endpointUrl = 'http://localhost:5000/extractor'; // URL of the endpoint to pass the PDF file
    const formData = new FormData();
    formData.append('resume', pdfFile, 'file.pdf');

    const user = await User.findById(userId)
    const project = await Project.findById(projectId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if(!project){
      return res.status(404).json({ message: 'Project not found' });
    }

    // Send the PDF file to the endpoint using Axios
    axios.post(endpointUrl, formData, {
      headers: formData.getHeaders()
    })
    .then(response => {
      // Create a new instance of the model using the extracted information
    const resume = new Resume({
      name:response.data.name,
      mobile_no:response.data.mobile_no,
      email:response.data.email,
      skills:response.data.skills,
      category:response.data.category,
      description:description,
      user: user._id,
      project: project._id
    });

    resume.save();
    user.resumes.push(resume);
    user.save();
    project.resumes.push(resume)
    project.save()
    res.status(201).json(resume);
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to retrieve PDF content' });
    });

};

exports.getResumeById = async (req,res) => {
  const id = req.params.id;

    Resume.findById(id)
    .populate('user','-password')
    .populate('project')
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found Application with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving Application with id=" + id });
      });
}

exports.getAllResumes = async(req,res) => {
  try {
    const resumes = await Resume.find().populate('user', '-password').populate('project'); // populate the 'user' field with user data and exclude the password field
    res.json(resumes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

exports.deleteResume = async (req,res) => {
  const { id } = req.params

  Resume.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Resume with id=${id}. Maybe Resume was not found!`
          });
        } else {
          res.send({
            message: "Resume was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Resume with id=" + id
        });
      });
}









