import express from 'express';
import { signup, login, logout } from '../controllers/auth.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);


router.post('/logout', logout);

router.patch("/update-profile", verifyJWT, updateProfile)

export default router;