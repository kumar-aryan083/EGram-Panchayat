

import express from 'express'
import verifyToken from '../middlewares/verifyToken.js';
import { approve, getNoti, reject, saveNoti } from '../controllers/com.controller.js';

const router = express.Router()

router.get('/get-noti', getNoti)
router.post('/save-noti', verifyToken, saveNoti)
router.get('/approve/:serviceId/:userId', verifyToken, approve);
router.get('/reject/:serviceId/:userId', verifyToken, reject);


export default router;