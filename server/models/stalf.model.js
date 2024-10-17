import mongoose from 'mongoose';

// Define the Admin schema
const stalfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  uServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Services'
  }]
}, { timestamps: true });

const Admin = mongoose.model('Stalf', stalfSchema);

export default Admin;