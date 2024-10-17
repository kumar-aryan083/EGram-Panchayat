import express from 'express'
import { applyScheme, approvedServices, checkUser, login, pendingServices, register, removeService, updateDp } from '../controllers/user.controller.js';
import verifyToken from '../middlewares/verifyToken.js';


const router = express.Router()

router.post('/register', register);
router.post('/login', login);
router.get('/check', verifyToken, checkUser)
router.get('/apply/:id', verifyToken, applyScheme)
router.put('/update-profile-pic', verifyToken, updateDp)
router.get('/Pending-Applied-Services',verifyToken, pendingServices)
router.get('/Approved-Applied-Services', verifyToken, approvedServices);
router.delete('/remove/:id', verifyToken, removeService);

export default router;