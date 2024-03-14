import mongoose, { models } from "mongoose";


const projectSchema = new mongoose.Schema({
    title : {
        type : String,
    },
    description : {
        type : String,
    },
    updates : [{
        name: {
            type: String,
        },
        content: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: String,
    },
    client : {
        type : String,
    },
    employees : [{
        type : String,
    }]
},{
    timestamps:true
})

export default models.Project || mongoose.model("Project",projectSchema)