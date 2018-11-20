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
        published: true,
        author: '3',
    },
    {
        id: '2',
        title: 'post 2',
        body: 'body 2',
        published: true,
        author: '1'
    },
    {
        id: '3',
        title: 'post 3',
        body: '',
        published: false,
        author: '1'
    },
];

const comments = [
    {
        id: '1',
        text: 'text 1',
        author: '3',
        post: '1'
    },
    {
        id: '2',
        text: 'text 2',
        author: '3',
        post: '1'
    },
    {
        id: '3',
        text: 'text 3',
        author: '2',
        post: '3'
    },
];

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
        comments(parent, args, ctx, info) {
            return comments;
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
        }
    },
    User: {
        posts(parent, args, ctx, info) {
          return posts.filter((post) => {
            return post.author === parent.id;
          });
        },  
        comments(parent, args, ctx, info) {
          return comments.filter((comment) => {
            return comment.author === parent.id;
          });
        }  
    },
    Post: {
        author(parent, args, ctx, info) {
          return users.find((user) => {
            return user.id === parent.author;
          });
        },  
        comments(parent, args, ctx, info) {
          return comments.filter((comment) => {
            return comment.post === parent.id;
          });
        },  
    },
    Comment: {
        author(parent, args, ctx, info) {
          return users.find((user) => {
            return user.id === parent.author;
          });
        },  
        post(parent, args, ctx, info) {
            return posts.find((post) => {
                return post.id === parent.post;
            });
        }
    }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => console.log(`SERVER RUNNING ON PORT: 4000`));