import userModel from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import serviceModel from '../models/service.model.js';
import { initializeApp } from "firebase/app";
import { getStorage, ref, deleteObject } from 'firebase/storage';
import applicationModel from '../models/application.model.js';
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



export const checkUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        if (user) {
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
        const user = await userModel.findOne({ email });
        if (user) {
            return res.status(401).json({
                success: false,
                message: 'User already exisits'
            })
        }
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new userModel({
            name: name,
            email: email,
            password: hash
        })
        const { password, ...others } = newUser._doc;
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT);

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

        const user = await userModel.findOne({
            $or: [
                { email: id }
            ]
        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not exists'
            })
        }
        if (bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ id: user._id }, process.env.JWT);
            const { password, ...others } = user._doc;
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
export const applyScheme = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        console.log(req.user.id);
        const service = await serviceModel.findById(req.params.id);
        const application = await applicationModel.findOne({
            userId: user._id ,
            serviceId: service._id
        })
        if(application) {
            return res.status(200).json({
                success: false,
                message: 'Already applied for this scheme'
            });
        }
        const newApplication = new applicationModel({
            userId: user._id,
            serviceId: service._id
        })
        await newApplication.save();
        user.applications.push(newApplication._id);
        await user.save();
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User Not Found...'
            })
        }
        if(service.applied.includes(user._id)){
            return res.status(200).json({
                message: "Already applied"
            })
        }

        user.appliedServices.push(service._id);
        await user.save();

        service.applied.push(user._id);
        await service.save();



        res.json({
            success: true,
            service,
            user,
            message: 'Successfully Applied'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 internal server error'
        })
    }
}
export const updateDp = async (req, res) => {
    try {
        const userId = req.user.id;  // Assume `req.user` contains the user's ID from middleware
        const { dpImg } = req.body;    // New image URL coming from the frontend

        // Fetch the current user record from the database
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        const defaultImageUrl = 'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg';

        // Check if the current dpImg is not the default one
        // Check if the current dpImg is not the default one
        if (user.dpImg && user.dpImg !== defaultImageUrl) {
            // Extract the image path correctly
            const imagePath = user.dpImg.split('/ProfilePic/')[1];

            // Check if imagePath is defined before calling split on it
            if (user.dpImg && user.dpImg !== defaultImageUrl) {
                // Extract the filename from the URL
                const imageUrl = user.dpImg;

                // Decode the URL before processing
                const decodedUrl = decodeURIComponent(imageUrl);

                // Extract the filename from the decoded URL
                const imagePath = decodedUrl.substring(decodedUrl.lastIndexOf('/ProfilePic/') + '/ProfilePic/'.length);

                // If the imagePath contains parameters, remove them
                const fileName = imagePath.split('?')[0]; // Extract the file name without query parameters

                // Check if the fileName is defined before using it
                if (user.dpImg && user.dpImg !== defaultImageUrl) {
                    // Extract the filename from the URL
                    const imageUrl = user.dpImg;

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

        user.dpImg = dpImg;
        await user.save();
        const { password, ...others } = user._doc;
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

export const pendingServices = async (req, res) => {
    try {
        // Fetch the user by ID from the request object
        const user = await userModel.findById(req.user.id).populate('applications');

        // If user not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Find applications with status 'pending' and populate the service details
        const pendingApplications = await applicationModel.find({
            _id: { $in: user.applications },
            status: 'pending'
        }).populate('serviceId');

        // Extract and send only the array of populated serviceIds
        const pendingServices = pendingApplications.map(app => app.serviceId);

        // Return the pending services
        res.status(200).json({
            success: true,
            pendingServices: pendingServices
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 internal server error'
        });
    }
};


export const approvedServices = async (req, res) => {
    try {
        // Fetch the user by ID from the request object
        const user = await userModel.findOne({ _id: req.user.id }).populate('applications');

        // If user not found
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Find applications with status 'approved' and populate the service details
        const approvedApplications = await applicationModel.find({
            _id: { $in: user.applications },
            status: 'approved'
        }).populate('serviceId');
        // Extract and send only the array of populated serviceIds
        const approvedServices = approvedApplications.map(app => app.serviceId);
        console.log(approvedServices)
        // Return the approved services
        res.status(200).json({
            success: true,
            approvedServices: approvedServices
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 internal server error'
        });
    }
}; 

export const removeService = async (req, res) => {
    try {
        // Find the application by id
        const application = await applicationModel.findOne({
            userId: req.user.id,   // Ensure the userId matches
            serviceId: req.params.id   // Ensure the serviceId matches
        });
        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }
        const deleteApp = await applicationModel.findByIdAndDelete(application._id);

        // Destructure userId and serviceId from application
        const { userId, serviceId } = application;

        // Delete the application
        await applicationModel.findByIdAndDelete(req.params.id);

        // Concurrently update User and Service documents using Promise.all
        const [userUpdate, serviceUpdate] = await Promise.all([
            // Update User: Remove application._id from applications array and service._id from appliedServices
            userModel.updateOne(
                { _id: userId },
                {
                    $pull: {
                        applications: application._id,
                        appliedServices: serviceId
                    }
                }
            ),
            // Update Service: Remove user._id from applied array
            serviceModel.updateOne(
                { _id: serviceId },
                {
                    $pull: { applied: userId }
                }
            )
        ]);

        // If needed, log for debugging
        console.log('User Update Result:', userUpdate);
        console.log('Service Update Result:', serviceUpdate);

        return res.status(200).json({
            success: true,
            message: 'Application removed successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: '500 internal server error'
        });
    }
};
