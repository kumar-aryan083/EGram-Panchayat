import mongoose from 'mongoose';

// Define the Admin schema
const adminSchema = new mongoose.Schema({
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
  dpImg: {
    type: String,
    default: 'https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg'
  },
  cServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  uServices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }]
}, { timestamps: true });

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;