import { Schema, model } from 'mongoose';

const EditInfoSchema = new Schema({
    hfImg: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    hfHeading: {
        type: String,
        required: true
    },
    hfParagraph: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Info = model('Info', EditInfoSchema);

export default Info;
