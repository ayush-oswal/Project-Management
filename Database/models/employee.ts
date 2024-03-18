import mongoose, { models } from "mongoose";


const employeeSchema = new mongoose.Schema({
    name : {
        type : String,
        unique : true,
        index : true
    },
    password : {
        type : String,
    },
    projects : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Project"
    }]
})

export default models.Employee || mongoose.model("Employee",employeeSchema)