
const Message = require("../models/conversation.js")

const sendMessage = async (req, res) => {
    try {
        const { msg, reciever } = req.body;
        const user = req.user.username;
        const conversation = new Message({
            sender: user,
            reciever,
            message: msg,
        });
        await conversation.save();
        res.status(201).json({ msg: "send msg" });
    } catch (error) {
        console.log(error);

    }
}

const recieverMessage = async (req, res) => {
    try {
        const user = req.user.username;
        const msg = await Message.find({ reciever: user });
        if (!msg) {
            res.status(500).json({ msg: 'message is not received' });

        }

        res.status(201).json({ recieverMessageg: msg });
    } catch (error) {
        console.log(error);

    }
}

module.exports = { sendMessage, recieverMessage };