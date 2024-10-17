import express from 'express'
import { addNewService, allApplication, checkAdmin, createdServices, deleteService, login, register, updateDp, updatedServices, updateService } from '../controllers/admin.controller.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router()

router.get('/checkAdmin', verifyToken, checkAdmin);
router.get('/createdServices', verifyToken, createdServices);
router.get('/updatedServices', verifyToken, updatedServices);
router.post('/register', register);
router.post('/login', login); 
router.post('/add-service',verifyToken, addNewService);
router.delete('/delete-service',verifyToken, deleteService);
router.put('/update-service',verifyToken, updateService); 
router.put('/update-profile-pic', verifyToken, updateDp);
router.post('/all-applications', verifyToken, allApplication)



export default router;