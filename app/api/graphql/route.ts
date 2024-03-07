import { NextApiRequest, NextApiResponse } from 'next';
import { graphql, GraphQLSchema } from 'graphql';
import schema from '@/Schema/schema'; // Import your existing GraphQL schema
import ConnectDB from '@/Database';

export const GET = async(req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Execute the GraphQL query against the schema

        await ConnectDB();

        const result = await graphql({
            schema: schema as GraphQLSchema, // Ensure correct type
            source: `{ HelloWorld }`, // GraphQL query
        });

        // Check for errors
        if (result.errors) {
            return new Response(JSON.stringify({ errors: result.errors }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        // Return the result
        return new Response(JSON.stringify({ data: result.data }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error processing GraphQL request:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
