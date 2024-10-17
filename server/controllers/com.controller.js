import adminModel from '../models/admin.model.js'
import userModel from '../models/user.model.js'
import notificationModel from "../models/notification.model.js";
import applicationModel from '../models/application.model.js';
import serviceModel from '../models/service.model.js';

export const getNoti = async (req, res) => {
    try {
        const noti = await notificationModel.find();
        res.json({
            success: true,
            message: 'Notification Fetched',
            noti
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 Internal error'
        })
    }
}
export const saveNoti = async (req, res) => {
    try {
        console.log(req.body)
        let t = false;
        if (req.body.settingUp === 'no') {
            t = false
        } else {
            t = true
        }
        const noti = await notificationModel({
            tagState: t,
            tagCont: req.body.subject,
            desc: req.body.desc,
            title: req.body.title,
            tagCont: req.body.subject
        });
        await noti.save();
        res.status(200).json({
            success: true,
            message: 'Announcement Added Successfully',
            noti
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 Internal error'
        })
    }
}
export const approve = async (req, res) => {
    try {
        const adminId = req.user.id;
        const admin = await adminModel.findOne({ _id: adminId });
        if (!admin) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied'
            });
        }

        const user = await userModel.findOne({ _id: req.params.userId });
        const application = await applicationModel.findOne({
            userId: req.params.userId,
            serviceId: req.params.serviceId
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Service not found for this user'
            });
        }

        application.status = "approved";
        await application.save();

        res.status(200).json({
            success: true,
            message: `Service Approved Successfully for ${user.name}`,
            application
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 Internal error'
        });
    }
};

export const reject = async (req, res) => {
    try {
        const adminId = req.user.id;
        const admin = await adminModel.findOne({ _id: adminId });
        if (!admin) {
            return res.status(403).json({
                success: false,
                message: 'Access Denied'
            });
        }

        const user = await userModel.findOne({ _id: req.params.userId });
        const application = await applicationModel.findOne({
            userId: req.params.userId,
            serviceId: req.params.serviceId
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found for this user'
            });
        }

        application.status = "rejected";
        await application.save();
        const service = await serviceModel.findOne({_id: req.params.serviceId})
        service.applied.pop(application._id);
        await applicationModel.findByIdAndDelete(application._id);
        res.status(200).json({
            success: true,
            message: `Service Rejected Successfully for ${user.name}`
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: '500 Internal error'
        })
    }
}