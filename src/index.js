import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
    type Query {
        id: ID!
        name: String!
        age: Int!
        employed: Boolean!
        gpa: Float
    }
`;

const resolvers = {
    Query: {
        id() {
            return 'ABC123'
        },
        name() {
            return 'Mario Zamora'
        },
        age() {
            return 31
        },
        employed() {
            return true
        },
        gpa() {
            return null
        }
    }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log(`SERVER RUNNING ON PORT: 4000`) )