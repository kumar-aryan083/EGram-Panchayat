
import stalfModel from '../models/stalf.model.js';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        const { email, name } = req.body;
        const stalf = await stalfModel.findOne({ email });
        if (stalf) {
            return res.status(401).json({
                success: false,
                message: 'User already exisits'
            })
        }
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        const newStalf = new stalfModel({
            name: name,
            email: email,
            password: hash
        })
        const { password, ...others } = newStalf._doc;
        await newStalf.save();
        const token = jwt.sign({ id: newStalf._id }, process.env.JWT);

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
        console.log(id);
        const stalf = await stalfModel.findOne({
            $or: [
                { email: id }
            ]
        })
        console.log(stalf);
        if (!stalf) {
            return res.status(404).json({
                success: false,
                message: 'User not exists'
            })
        }
        if (bcrypt.compareSync(password, stalf.password)) {
            const { password, ...others } = stalf._doc;
            const token = jwt.sign({ id: stalf._id }, process.env.JWT);

        res.cookie('token', token, {
            httpOnly: true
        }).status(200).json({
                success: true,
                message: 'Logged In successfully',
                user: others
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 internal server error'
        })
    }
}
export const updateService = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 internal server error'
        })
    }
}
export const updatedService = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 internal server error'
        })
    }
}
export const check = async (req, res) => {
    try {
        console.log(req.user.id);
        const stalf = await stalfModel.findById(req.user.id);
        console.log(stalf);
        if (stalf) {
            return res.status(200).json({
                success: true,
            })
        }
        return res.status(200).json({
            success: false
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
        console.log('hit')
        const stalfId = req.user.id;  // Assume `req.user` contains the user's ID from middleware
        const { dpImg } = req.body;    // New image URL coming from the frontend

        // Fetch the current user record from the database
        const user = await userModel.findById(stalfId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Stalf not found'
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