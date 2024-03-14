
import bcrypt from "bcrypt"
import Client from "@/Database/models/Client";
import Employee from "@/Database/models/Employee";
import Project from "@/Database/models/Project";
import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";




//Types

const updateType = new GraphQLObjectType({
    name : "Update",
    fields : () => ({
        name : {type:GraphQLString},
        content : {type:GraphQLString},
        createdAt : {type:GraphQLString}
    })
})

const projectType = new GraphQLObjectType({
    name : "Project",
    fields : () => ({
        id : {type : GraphQLID},
        title : {type : GraphQLString},
        description : {type : GraphQLString},
        updates : {type : new GraphQLList(updateType)},
        status : {type : GraphQLString},
        client : {type : GraphQLString},
        employees : {type : new GraphQLList(GraphQLString)},
        createdAt : {type:GraphQLString},
        updatedAt : {type:GraphQLString}
    })
})

const employeeType = new GraphQLObjectType({
    name : "Employee",
    fields : () => ({
        name : {type:GraphQLString},
        projects : {
            type : new GraphQLList(projectType),
            resolve : async(parent,args)=>{
                const allProjects = await Project.find({ _id: { $in: parent.projects } });
                return allProjects;
            }
        }
    })
})

const clientType = new GraphQLObjectType({
    name : "Client",
    fields : () => ({
        name : {type : GraphQLString}
    })
})


//Query

const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields : {
        projects : {
            type : new GraphQLList(projectType),
            resolve : async(parent,args)=>{
                const projects = await Project.find();
                const sortedProjects = projects.sort((a, b) => {
                    // Define the order of status values
                    const statusOrder: { [key: string]: number } = {
                      'not started': 0,
                      'in progress': 1,
                      'completed': 2,
                    };
                    return statusOrder[a.status] - statusOrder[b.status];
                  });
              
                return sortedProjects;
            }
        },
        project : {
            type : projectType,
            args : {
                id : {type : GraphQLID}
            },
            resolve : async(parent,args) => {
                return await Project.findById(args.id)
            }
        },
        clients : {
            type : new GraphQLList(clientType),
            resolve : async(parent,args)=>{
                return await Client.find();
            }
        },
        employees : {
            type : new GraphQLList(employeeType),
            resolve : async(parent,args)=>{
                return await Employee.find();
            }
        },
        employee : {
            type : employeeType,
            args : {
                id : {type : new GraphQLNonNull(GraphQLID)}
            },
            resolve : async(parent,args) => {
                return await Employee.findById(args.id)
            }
        }
    }
});


//Mutations

const mutation = new GraphQLObjectType({
    name : "Mutation",
    fields : {
        //Client
        addClient : {
            type : clientType,
            args : {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve : async(parent,args)=>{
                const newClient = new Client({
                    name : args.name
                })
                return await newClient.save();
            }
        },
        //Employee
        addEmployee : {
            type : employeeType,
            args : {
                name : { type: new GraphQLNonNull(GraphQLString) },
                password : { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve : async(parent,args)=>{
                const salt: string = await bcrypt.genSalt();
                const hash = await bcrypt.hash(args.password,salt);
                const newEmployee = new Employee({
                    name : args.name,
                    password : hash
                })
                return await newEmployee.save()
            }
        },
        //Project
        addProject : {
            type : projectType,
            args : {
                title : { type: new GraphQLNonNull(GraphQLString) },
                description : { type: new GraphQLNonNull(GraphQLString) },
                status : { type : new GraphQLNonNull(GraphQLString) },
                client : { type : new GraphQLNonNull(GraphQLString) },
                employees : { type : new GraphQLNonNull( new GraphQLList(GraphQLString)) }
            },
            resolve : async(parent,args)=>{
                // console.log(args)
                const newProject = new Project({
                    title : args.title,
                    description : args.description,
                    status : args.status,
                    client : args.client,
                    employees : args.employees
                })
                // const savedProject = await newProject.save();
                // // Update each employee with the new project id
                // await Employee.updateMany(
                //     { name: { $in: args.employees } },
                //     { $push: { projects: savedProject._id } }
                // );
                // return savedProject; 
                return newProject; 
            }
        },
        addComment : {
            type : projectType,
            args : {
                id : { type : new GraphQLNonNull(GraphQLID) },
                name : { type : new GraphQLNonNull(GraphQLString) },
                content : { type : new GraphQLNonNull(GraphQLString) }
            },
            resolve : async(parent,args) => {
                const project = await Project.findById(args.id)
                const newComment = {
                    name : args.name,
                    content : args.content
                }
                project.updates.push(newComment);
                return await project.save()
            }
        },
        updateProject : {
            type : projectType,
            args : {
                id : { type : new GraphQLNonNull(GraphQLID) },
                title : { type: new GraphQLNonNull(GraphQLString) },
                description : { type: new GraphQLNonNull(GraphQLString) },
                status : { type : new GraphQLNonNull(GraphQLString) },
                client : { type : new GraphQLNonNull(GraphQLString) },
                employees : { type : new GraphQLNonNull( new GraphQLList(GraphQLString)) }
            },
            resolve : async(parent,args) => {
                return await Project.updateOne({ _id : args.id } , { $set : 
                    {   
                        title : args.title, 
                        description : args.description,
                        status : args.status,
                        client : args.client,
                        employees : args.employees  
                    } 
                })
            }
        },
        deleteProject : {
            type : GraphQLString,
            args : {
                id : { type : new GraphQLNonNull(GraphQLID) },
            },
            resolve : async(parent,args) => {
                try{
                    Project.deleteOne( { _id : args.id } )
                    return "ok"
                }
                catch(err){
                    console.log(err)
                    return "Error"
                }
            }
        }
    }
})



export default new GraphQLSchema({
    query : RootQuery,
    mutation
})