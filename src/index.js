import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
    type Query {
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

const resolvers = {
    Query: {
        me() {
            return {
                id: 'ABC123',
                name: 'Me',
                email: 'me@mail.com'
            };
        },
        post() {
            return {
                id: 'ABC456',
                title: 'post 1',
                body: 'body 1',
                published: true
            };
        },
    }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log(`SERVER RUNNING ON PORT: 4000`));