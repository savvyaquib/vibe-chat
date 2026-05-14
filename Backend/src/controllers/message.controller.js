
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