import express from 'express'
import { check, login, register, updateDp, updatedService, updateService } from '../controllers/stalf.controller.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router()

router.post('/register', register);
router.post('/login', login);
router.put('/update-service',verifyToken, updateService);
router.get('/updated-service',verifyToken, updatedService);
router.get('/check-stalf', verifyToken, check)
router.post('/update-profile-pic', verifyToken, updateDp)


export default router;