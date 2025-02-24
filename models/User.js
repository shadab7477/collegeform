import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure emails are unique
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
        required: true, // Password is required
    },
    status: {
        type: String,
        enum: ['Complete', 'Pending'],
        default: 'Pending', // Default status is Pending
    },
    remark: { 
        type: String, 
        default: "" 
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

const User = mongoose.model('User', userSchema);

export default User;
