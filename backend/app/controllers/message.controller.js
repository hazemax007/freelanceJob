const db = require('../models')
const Message = db.message
const User = db.user

const {Server} = require('socket.io');
const io = new Server({
  cors: {
    origin: '*'
  }
});


exports.postMessage = async (req,res) => {
  const {senderId} = req.params
  const {receiverId} = req.params
  const {content} = req.body
  try{
    const sender = await User.findById(senderId)
    const receiver = await User.findById(receiverId)
    if (!sender) {
      return res.status(404).json({ message: 'User not found' });
    }
    if(!receiver){
      return res.status(404).json({ message: 'Project not found' });
    }
    const message = new Message({
      content,
      sender: sender._id,
      receiver: receiver._id
    });
    await message.save();
    sender.messages.push(message);
    await sender.save();
    receiver.messages.push(message)
    await receiver.save()
    try {
      io.emit('newMessage');
     // res.status(200).send('socket triggered');
    } catch (e) {
      console.log(e);
    }
    res.status(201).json(message);

  }catch (error){  
    res.status(500).json({ message: error.message });

  }
}

exports.getAllMessages = async(req,res) => {
  try {
    const messages = await Message.find().populate('sender', '-password').populate('receiver','-password'); // populate the 'user' field with user data and exclude the password field
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}

exports.getChatMessages = async (req,res) =>{
  try {
    const { senderId, receiverId } = req.params;

    Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    })
      .then(messages => {
        const modifiedMessages = messages.map(message => {
          if (message.sender._id == senderId) {
            return { ...message.toObject(), isSent: true, isReceived: false };
          } else {
            return { ...message.toObject(), isSent: false, isReceived: true };
          }
        });
        res.json(modifiedMessages);
      })
      .catch(err => res.status(500).json({ error: err.message }));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}



/*exports.getMessage = function(io) {
  (req,res) => {
    Message.find()
      .sort({ timestamp: 1 })
      .then((messages) => res.json(messages))
      .catch((error) => res.status(500).json({ error }));
  }

}*/

/*exports.postMessage = (req,res) => {
  const { text, sender } = req.body;
  const message = new Message({ text, sender });
  message
    .save()
    .then(() => {
      io.emit('chat message', message);
      res.status(201).json(message);
    })
    .catch((error) => res.status(500).json({ error }));
}*/

io.on('connection', () => {
  console.log('socket connected');
});

io.listen(8081);