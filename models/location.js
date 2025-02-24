import mongoose from "mongoose";



const locationSchema = new mongoose.Schema({
    name: String
});


const Location = mongoose.model('Location', locationSchema);

export default Location