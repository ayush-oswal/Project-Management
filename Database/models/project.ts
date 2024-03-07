import mongoose, { models } from "mongoose";


const projectSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    updates : [{
        name: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    client : {
        name : String,
        required : true
    },
    employees : [{
        name : String,
        required : true
    }]
},{
    timestamps:true
})

export default models.Project || mongoose.model("Project",projectSchema)