

import express from 'express'
import { allService, getInfo, newAdded, saveInfo } from '../controllers/service.controller.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router()

router.get('/all-service', allService);
router.get('/new-added', newAdded);
router.get('/get-info', getInfo);
router.post('/save-info',verifyToken, saveInfo);
router.post('/add-noti', verifyToken, );


export default router;