import { GraphQLServer } from 'graphql-yoga';

// Demo data
const users = [
    {
        id: '1',
        name: 'name 1',
        email: 'name1@mail.com',
        age: 31
    },
    {
        id: '2',
        name: 'name 2',
        email: 'name2@mail.com',
    },
    {
        id: '3',
        name: 'name 3',
        email: 'name3@mail.com',
    },
];

const posts = [
    {
        id: '1',
        title: 'post 1',
        body: 'body 1',
        published: true
    },
    {
        id: '2',
        title: 'post 2',
        body: 'body 2',
        published: true
    },
    {
        id: '3',
        title: 'post 3',
        body: '',
        published: false
    },
];

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
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
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users;
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase());
            })
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            }

            return posts.filter((post) => {
                const titleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
                const bodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
                return titleMatch || bodyMatch;
            })
        },
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