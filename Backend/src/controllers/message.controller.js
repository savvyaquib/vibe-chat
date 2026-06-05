import Message from "../models/message.model.js"
import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js"
import { io, onlineUsers } from "../lib/socket.js"


export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } }).select("name email profilePic")
        res.status(200).json({ users })
    } catch (error) {
        console.error("Error fetching users:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id } = req.params
        const currentUserId = req.user.id

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: id },
                { sender: id, receiver: currentUserId },
            ],
        })
            .sort({ timestamp: 1 })
            .populate("sender", "name email profilePic")
            .populate("receiver", "name email profilePic")

        res.status(200).json({ messages })
    } catch (error) {
        console.error("Error fetching messages:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { id } = req.params
        const { content, text, image } = req.body
        const messageContent = content || text

        if (!messageContent && !image) {
            return res.status(400).json({ message: "Message text or image is required" })
        }

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "vibe-chat",
                resource_type: "image",
            })
            imageUrl = uploadResponse.secure_url
        }

        const message = await Message.create({
            sender: req.user.id,
            receiver: id,
            content: messageContent,
            image: imageUrl,
        })

        const populatedMessage = await Message.findById(message._id)
            .populate("sender", "name email profilePic")
            .populate("receiver", "name email profilePic")

        const receiverSocketId = onlineUsers.get(id)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("message_received", populatedMessage)
        }

        res.status(201).json({ message: populatedMessage })
    } catch (error) {
        console.error("Error sending message: ", error)
        res.status(500).json({ message: "Internal server error" })
    }
}