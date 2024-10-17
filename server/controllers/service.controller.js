import serviceModel from "../models/service.model.js";
import infoModel from '../models/info.model.js'
import notificationModel from "../models/notification.model.js";

export const allService = async (req, res) => {}

export const newAdded = async (req, res) => {
    try {
        // Fetch top 6 services, sorted by the most recently added based on their _id
        const services = await serviceModel.find()
            .sort({ _id: -1 })  // Sort by '_id' in descending order (most recent first)
            .limit(6);  // Limit the result to the top 6 documents

        res.status(200).json({ success: true, services });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch new services", error: error.message });
    }
};


export const getInfo = async (req, res) => {
    try {
        // Find the latest document using sort and limit
        const latestInfo = await infoModel.findOne().sort({ createdAt: -1 });

        if (!latestInfo) {
            return res.status(404).json({ message: "No info found" });
        }

        // Send the latest document as a response
        res.status(200).json(latestInfo);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export const saveInfo = async (req, res) => {
    const { hfImg, name, age, hfHeading, hfParagraph } = req.body;
    console.log('hit')
    try {
        // Create a new document with the provided data
        const newInfo = new infoModel({
            hfImg,
            name,
            age,
            hfHeading,
            hfParagraph
        });

        // Save the document to the database
        const savedInfo = await newInfo.save();

        // Respond with the saved document
        res.status(201).json(savedInfo);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: "Failed to save info", error: error.message });
    }
};
export const addNoti = async (req, res) => {
    try {
        const newNoti = await notificationModel({
            ...req.body
        })

        res.status(200).json({
            success: true,
            message: 'New notification save',
            notification: newNoti
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500, internal server error'
        })
    }
}