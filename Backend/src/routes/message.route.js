import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router()

router.use(verifyJWT)

router.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the messages route" })
})

router.get("/users", getUsers)

router.get("/:id", getMessage)

export default router;