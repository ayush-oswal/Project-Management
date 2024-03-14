import mongoose, { models } from "mongoose";


const clientSchema = new mongoose.Schema({
    name : {
        type : String,
        unique : true,
    }
})

export default models.Client || mongoose.model("Client",clientSchema);