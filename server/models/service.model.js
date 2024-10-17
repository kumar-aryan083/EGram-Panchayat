import mongoose from "mongoose";

const serviceModel = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sImg: {
        type: String,
        Required: true,
        default: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/201908/Add_a_subheading_1_.png?VersionId=MoNEvek00g1J_WpgxJkZkiQbvUs3SVU7'
    },
    tVac: {
        type: String,
        Required: true
    },
    applied: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true})

export default mongoose.model('Service', serviceModel);