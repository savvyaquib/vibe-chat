import Message from "../models/message.model.js"
import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js"
import { io, onlineUsers } from "../lib/socket.js"


export const getUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const users = await User.find({ _id: { $ne: currentUserId } }).select("name fullName email profilePic");

        const unreadMessages = await Message.aggregate([
            { $match: { receiver: currentUserId, isRead: false } },
            { $group: { _id: "$sender", count: { $sum: 1 } } }
        ]);

        const latestMessages = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: currentUserId }, { receiver: currentUserId }]
                }
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", currentUserId] },
                            then: "$receiver",
                            else: "$sender"
                        }
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            }
        ]);

        const unreadCounts = {};
        unreadMessages.forEach(item => {
            unreadCounts[item._id.toString()] = item.count;
        });

        const lastMessageMap = {};
        latestMessages.forEach(item => {
            lastMessageMap[item._id.toString()] = item.lastMessage;
        });

        const usersWithData = users.map(user => ({
            ...user.toObject(),
            unreadCount: unreadCounts[user._id.toString()] || 0,
            lastMessage: lastMessageMap[user._id.toString()] || null
        }));

        res.status(200).json({ users: usersWithData })
    } catch (error) {
        console.error("Error fetching users:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id } = req.params
        const currentUserId = req.user._id

        await Message.updateMany(
            { sender: id, receiver: currentUserId, isRead: false },
            { $set: { isRead: true } }
        );

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: id },
                { sender: id, receiver: currentUserId },
            ],
        })
            .sort({ timestamp: 1 })
            .populate("sender", "name fullName email profilePic")
            .populate("receiver", "name fullName email profilePic")

        res.status(200).json({ messages })
    } catch (error) {
        console.error("Error fetching messages:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { id } = req.params
        const { content, text, image, images } = req.body
        const messageContent = content || text

        if (!messageContent && !image && (!images || images.length === 0)) {
            return res.status(400).json({ message: "Message text or image is required" })
        }

        const imageUrls = [];

        if (Array.isArray(images) && images.length > 0) {
            for (const imageData of images) {
                if (!imageData) continue;
                const uploadResponse = await cloudinary.uploader.upload(imageData, {
                    folder: "vibe-chat",
                    resource_type: "image",
                })
                imageUrls.push(uploadResponse.secure_url)
            }
        } else if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "vibe-chat",
                resource_type: "image",
            })
            imageUrls.push(uploadResponse.secure_url)
        }

        const message = await Message.create({
            sender: req.user._id,
            receiver: id,
            content: messageContent,
            image: imageUrls[0],
            images: imageUrls,
        })

        const populatedMessage = await Message.findById(message._id)
            .populate("sender", "name fullName email profilePic")
            .populate("receiver", "name fullName email profilePic")

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