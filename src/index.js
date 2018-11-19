import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
    type Query {
        hello: String!
        name: String!
        location: String!
        bio: String!
    }
`;

const resolvers = {
    Query: {
        hello() {
            return 'First Query'
        },
        name() {
            return 'Mario Zamora'
        },
        location() {
            return 'World'
        },
        bio() {
            return '...'
        }
    }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log(`SERVER RUNNING ON PORT: 4000`) )