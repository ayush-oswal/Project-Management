import mongoose, { models } from "mongoose";


const employeeSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    projects : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Project"
    }]
})

export default models.Employee || mongoose.model("Employee",employeeSchema)