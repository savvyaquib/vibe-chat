import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getMessages, getUsers, sendMessage, markMessagesAsRead } from "../controllers/message.controller.js";

const router = Router()

router.use(verifyJWT)

router.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the messages route" })
})

router.get("/users", getUsers)

router.get("/:id", getMessages)
router.post("/:id", sendMessage)
router.put("/mark-read/:id", markMessagesAsRead)

export default router;