
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } }).select("name email profilePic")
        res.status(200).json({ users })
    } catch (error) {
        console.error("Error fetching users:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}