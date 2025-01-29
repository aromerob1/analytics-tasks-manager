import express from 'express';

const router = express.Router();

// Auth routes

//Register user
router.post('/register', registerController);

//Login user
router.post('/login', loginController);


export default router;