import Message from "../models/Message.js"
import User from "../models/User.js"
import cloudinary from "../utils/cloudinary.js"


export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } }).select("name email profilePic")
        res.status(200).json({ users })
    } catch (error) {
        console.error("Error fetching users:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getMessage = async (req, res) => {
    try {
        const { id } = req.params
        const message = await Message.findById(id).populate("sender", "name email profilePic").populate("receiver", "name email profilePic")

        if (!message) {
            return res.status(404).json({ message: "Message not found" })
        }
        res.status(200).json({ message })
    } catch (error) {
        console.error("Error fetching message:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { id } = req.params
        const { content, image } = req.body

        let imageUrl;

        if (image) {
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "vibe-chat",
                resource_type: "image"
            })
            imageUrl = uploadResponse.secure_url
        }
        const message = await Message.create({
            sender: req.user.id,
            receiver: id,
            content,
            image: imageUrl
        })

        res.status(201).json({ message })
    } catch (error) {
        console.error("Error sending message: ", error)
        res.status(500).json({ message: "Internal server error" })
    }
}