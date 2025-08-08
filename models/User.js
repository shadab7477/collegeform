import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    education: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['Complete', 'Pending'],
        default: 'Pending',
    },
    remark: { 
        type: String, 
        default: "" 
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;