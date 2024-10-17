import mongoose from 'mongoose'

const notificationSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    tagState: {
        type: Boolean,
        default: false
    },
    tagCont: {
        type: String
    }
}, {timestamps: true})

export default mongoose.model('Notification', notificationSchema);
