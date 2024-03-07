import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";


const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields : {
        HelloWorld : {
            type : GraphQLString,
            resolve(){
                return "HelloWorld";
            }
        }
    }
});

export default new GraphQLSchema({
    query : RootQuery
})