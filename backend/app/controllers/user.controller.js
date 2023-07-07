const db = require("../models");
const User = db.user
const Image = db.image
var bcrypt = require("bcryptjs");


exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };

  exports.getAllUsers = (req,res) => {

  User.find()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
  }

  exports.getUserById = (req,res) => {  
    const id = req.params.id;

    User.findById(id)
    .populate('image')
    .populate('resumes')
    .populate('messages')
      .then(data => {
        if (!data)
          res.status(404).send({ message: "Not found User with id " + id });
        else res.send(data);
      })
      .catch(err => {
        res
          .status(500)
          .send({ message: "Error retrieving User with id=" + id });
          console.log(err)
      });
  }

  exports.updateUser = async (req, res) => {
    const { username, email, password, firstname, lastname, birthdate, phonenumber, address } = req.body;
    const { intercontrat } = false
    const hashedPassword = await bcrypt.hash(password, 8);
    try {
      
      const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        username:username,
        email:email,
        password:hashedPassword,
        firstname:firstname,
        lastname:lastname,
        birthdate:birthdate,
        phonenumber:phonenumber,
        address:address,
        intercontrat:intercontrat,
      });
      res.status(200).json(updatedUser);

    } catch (error) {
      res.status(400).json({message: error.message});
  }
  };

  exports.deleteUser = (req,res) => {
    const id = req.params.id;

    User.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
          });
        } else {
          res.send({
            message: "User was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete User with id=" + id
        });
      });
  }


exports.defineIntercontrat = async (req,res) =>{
  const id = req.params.id;
  const user = await User.findById(id);
  user.intercontrat = !user.intercontrat;
  await user.save();
  res.sendStatus(200);
}

exports.getAllIntercontrats = async (req,res) => {
  const users = await User.find({ intercontrat: true }).populate('ratings');
  res.send(users);
}

exports.getIntercontratById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);

    if (user.intercontrat) {
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: 'User not found or intercontrat is not set to true' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: 'Server error' });
  }
};

exports.deleteIntercontrat = async (req,res) =>{
  const {id} = req.params
  User.findByIdAndRemove(id)
      .then(data => {
        if (!data) {
          res.status(404).send({
            message: `Cannot delete Intercontrat with id=${id}. Maybe Intercontrat was not found!`
          });
        } else {
          res.send({
            message: "Intercontrat was deleted successfully!"
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Intercontrat with id=" + id
        });
      });
}

exports.fetchUsers = async (req,res) =>{
  try {
    const {connectedUserId} = req.params; // Retrieve the ID of the connected user
    const users = await User.find({ _id: { $ne: connectedUserId } })
    .populate('messages').populate('image'); // Fetch all users except the connected user
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
