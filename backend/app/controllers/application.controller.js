const nodemailer = require('nodemailer');
const db = require('../models')
const Application = db.application
const User = db.user
const Project = db.project

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hazem.bensalem@esprit.tn',
    pass: '181JMT2837'
  }
});

exports.getAllApplications = async(req,res) => {
  try {
    const applications = await Application.find().populate('user', '-password').populate('project'); // populate the 'user' field with user data and exclude the password field
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

exports.addApplication = async (req,res) => {
  const { userId } = req.params
  const { projectId } = req.params
  const { file } = req.file
  const {name,startDate,description} = req.body
  try{
    const user = await User.findById(userId)
    const project = await Project.findById(projectId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if(!project){
      return res.status(404).json({ message: 'Project not found' });
    }
    const application = new Application({
      name,
      startDate,
      description,
      resume:{
        contentType: 'application/pdf',
        data: file
      },
      user: user._id,
      project: project._id
    });
    await application.save();
    user.applications.push(application);
    await user.save();
    project.applications.push(application)
    await project.save()
    res.status(201).json(application);

  }catch (error){  
    res.status(500).json({ message: error.message });

  }
}

exports.getApplicationById = async (req,res) => {
  const id = req.params.id;

    Application.findById(id)
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

exports.deleteApplication = async (req,res) => {
  const id = req.params.id;

    Application.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Application with id=${id}. Maybe Application was not found!`
          });
        } else {
          res.send({
            message: "Application was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Application with id=" + id
        });
      });
}

exports.sendDecision = async(req,res) => {
  const mailOptions = {
    from: 'hazem.bensalem@esprit.tn',
    to: req.body.email,
    subject: 'Application result',
    text: req.body.content
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully');
    }
  });
}

