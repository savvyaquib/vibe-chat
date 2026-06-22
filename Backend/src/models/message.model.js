import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    content: {
        type: String,
    },

    image: {
        type: String
    },

    images: [{
        type: String,
    }],

    isRead: {
        type: Boolean,
        default: false,
    },

    timestamp: {
        type: Date,
        default: Date.now
    },

    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
        default: null
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;