import jwt from 'jsonwebtoken'
import { initializeApp } from "firebase/app";
import { getStorage, ref, deleteObject } from 'firebase/storage';
import adminModel from '../models/admin.model.js';
import bcrypt from 'bcryptjs'
import serviceModel from '../models/service.model.js';

const firebaseConfig = {
    apiKey: "AIzaSyBF7_5f1ajIz-retCh2Jp1immFfwF3yRa8",
    authDomain: "egram-panchayat-ea1fa.firebaseapp.com",
    projectId: "egram-panchayat-ea1fa",
    storageBucket: "egram-panchayat-ea1fa.appspot.com",
    messagingSenderId: "106546508789",
    appId: "1:106546508789:web:851e4c9bacb6d0399526bc",
    measurementId: "G-RF1PCDF30Q"
  };
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


export const checkAdmin = async (req, res) => {
    try {
        const admin = await adminModel.findById(req.user.id);
        if (admin) {
            return res.status(200).json({
                success: true,
            })
        }
        return res.status(200).json({
            success: false
        })
    } catch (error) {

    }
}

export const register = async (req, res) => {
    try {
        const { email, name } = req.body;
        const admin = await adminModel.findOne({ email });
        if (admin) {
            return res.status(401).json({
                success: false,
                message: 'User already exisits'
            })
        }
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        const newAdmin = new adminModel({
            name: name,
            email: email,
            password: hash
        })
        const { password, ...others } = newAdmin._doc;
        await newAdmin.save();
        const token = jwt.sign({ id: newAdmin._id }, process.env.JWT);

        res.cookie('token', token, {
            httpOnly: true
        }).status(200).json({
            success: true,
            message: 'User created successfully.',
            user: others
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 internal server error'
        })
    }
}
export const login = async (req, res) => {
    try {
        const { id, password } = req.body;

        const admin = await adminModel.findOne({
            $or: [
                { email: id }
            ]
        })
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'User not exists'
            })
        }
        if (bcrypt.compareSync(password, admin.password)) {
            const token = jwt.sign({ id: admin._id }, process.env.JWT);
            const { password, ...others } = admin._doc;
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            })
                .status(200)
                .json({
                    success: true,
                    message: 'Logged in successfully',
                    user: others
                });

        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 internal server error'
        })
    }
}
export const addNewService = async (req, res) => {
    try {
        const newService = new serviceModel({ ...req.body })
        await newService.save();
        const admin = await adminModel.findOne({ _id: req.user.id });
        admin.cServices.push(newService._id);
        await admin.save();
        res.status(200).json({
            success: true,
            message: 'New Service is Added',
            user: admin
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 internal server error'
        })
    }
}
export const deleteService = async (req, res) => {
    try {
        const admin = await adminModel.findById(req.user.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found',
            });
        }

        const service = await serviceModel.findByIdAndDelete(req.body._id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found',
            });
        }

        admin.cServices = admin.cServices.filter(serviceId => serviceId.toString() !== req.body._id);
        admin.uServices = admin.uServices.filter(serviceId => serviceId.toString() !== req.body._id);

        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Service deleted',
            user: admin
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 internal server error',
        });
    }
};

export const updateService = async (req, res) => {
    try {
        const { title, description, tVac, sImg, id } = req.body;
        
        // Update the service
        const service = await serviceModel.findByIdAndUpdate(id, {
            title,
            description,
            tVac,
            sImg
        }, { new: true });

        // Check if the service exists
        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found',
            });
        }

        // Find the admin user
        const admin = await adminModel.findOne({ _id: req.user.id });

        // Check if the service._id is already in admin.uServices, and only push if not present
        if (!admin.uServices.includes(service._id)) {
            admin.uServices.push(service._id);
            await admin.save(); // Save the admin document only if the array was updated
        }

        // Send a success response
        res.status(200).json({
            success: true,
            message: 'Scheme updated successfully',
            service,
            user: admin
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 internal server error'
        });
    }
};


export const updateDp = async (req, res) => {
    try {
        const adminId = req.user.id;  // Assume `req.user` contains the admin's ID from middleware
        const { dpImg } = req.body;    // New image URL coming from the frontend

        // Fetch the current admin record from the database
        const admin = await adminModel.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        const defaultImageUrl = 'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg';

        // Check if the current dpImg is not the default one
        // Check if the current dpImg is not the default one
        if (admin.dpImg && admin.dpImg !== defaultImageUrl) {
            // Extract the image path correctly
            const imagePath = admin.dpImg.split('/ProfilePic/')[1];

            // Check if imagePath is defined before calling split on it
            if (admin.dpImg && admin.dpImg !== defaultImageUrl) {
                // Extract the filename from the URL
                const imageUrl = admin.dpImg;

                // Decode the URL before processing
                const decodedUrl = decodeURIComponent(imageUrl);

                // Extract the filename from the decoded URL
                const imagePath = decodedUrl.substring(decodedUrl.lastIndexOf('/ProfilePic/') + '/ProfilePic/'.length);

                // If the imagePath contains parameters, remove them
                const fileName = imagePath.split('?')[0]; // Extract the file name without query parameters

                // Check if the fileName is defined before using it
                if (admin.dpImg && admin.dpImg !== defaultImageUrl) {
                    // Extract the filename from the URL
                    const imageUrl = admin.dpImg;

                    // Decode the URL before processing
                    const decodedUrl = decodeURIComponent(imageUrl);

                    // Extract the filename from the decoded URL
                    const imagePath = decodedUrl.substring(decodedUrl.lastIndexOf('/ProfilePic/') + '/ProfilePic/'.length);

                    // If the imagePath contains parameters, remove them
                    const fileName = imagePath.split('?')[0]; // Extract the file name without query parameters

                    // Check if the fileName is defined before using it
                    if (fileName) {
                        const imageRef = ref(storage, `ProfilePic/${fileName}`);
                        console.log('Image reference for deletion:', imageRef);

                        try {
                            // Delete the old image from Firebase storage
                            await deleteObject(imageRef);
                            console.log('Previous image deleted from Firebase');
                        } catch (err) {
                            console.log('Error deleting previous image from Firebase:', err);
                        }
                    } else {
                        console.log('File name could not be extracted from the image path:', imagePath);
                    }
                }

            }

        }

        admin.dpImg = dpImg;
        await admin.save();
        const { password, ...others } = admin._doc;
        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            user: others
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 internal server error'
        });
    }
};
export const createdServices = async (req, res) => {
    try {
        const admin = await adminModel.findById(req.user.id).populate('cServices');
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        const { password, ...others } = admin._doc;
        const cServices = admin.cServices;
        res.status(200).json({
            success: true,
            user: others,
            cServices
        });
    } catch (error) {
        console.error('Error fetching created services:', error);
        res.status(500).json({
            success: false,
            message: '500 internal server error'
        });
    }
}

export const updatedServices = async (req, res) => {
    try {
        const admin = await adminModel.findById(req.user.id).populate('uServices');
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        const uServices = admin.uServices; // Use the populated uServices directly
        if (uServices.length === 0) {
            return res.status(200).json({
                success: true,
                uServices: []
            });
        }
        res.status(200).json({
            success: true,
            uServices
        });
    } catch (error) {
        console.error('Error fetching updated services:', error);
        res.status(500).json({
            success: false,
            message: '500 internal server errors'
        });
    }
}
export const allApplication = async (req, res) => { 
    try {
        const service = await serviceModel.findById(req.body.id);
        if(!service) {
            return res.status(404).json({
                success: false,
                message: 'Scheme not found'
            })
        }
        const fullService = await service.populate('applied');
        const applied = await fullService.applied;

        res.status(200).json({
            success: false,
            message: 'Data Fetched',
            persons: applied
        })
    } catch (error) {
        console.error('Error fetching updated services:', error);
        res.status(500).json({
            success: false,
            message: '500 internal server errors'
        });
    }
}