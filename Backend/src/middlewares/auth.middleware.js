import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res.status(400).json({ message: 'Unauthorized - no token provided' })
        }
        console.log(token)

        const decoded = jwt.verify(token, process.env.JWT_SECRET)


        const user = await User.findById(decoded?._id).select("-password")

        if (!user) {
            return res.status(400).json({ message: 'Invalid token' })
        }

        req.user = user;
        next()
    } catch (error) {
        console.error("Error in veryJWT middleware", error);
        res.status(401).json({ message: 'Invalid token' });

    }
}

export { verifyJWT }
