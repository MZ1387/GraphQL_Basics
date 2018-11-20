import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Demo data
let users = [
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

let posts = [
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

let comments = [
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

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!): Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!, 
        body: String!, 
        published: Boolean!, 
        author: ID!
    }

    input CreateCommentInput {
        text: String!, 
        author: ID!, 
        post: ID!
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
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.data.email);

            if (emailTaken) {
                throw new Error('Email taken.');
            }

            const user = {
                id: uuidv4(),
                ...args.data
            };

            users.push(user);

            return user;
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex((user) => user.id === args.id);

            if (userIndex === -1) {
                throw new Error('User not found.');
            }

            const deletedUsers = users.splice(userIndex, 1);

            posts = posts.filter((post) => {
                const match = post.author === args.id;

                if (match) {
                    comments = comments.filter((comment) => comment.post !== post.id);
                }

                return !match;
            });

            comments = comments.filter((comment) => comment.author !== args.id);

            return deletedUsers[0];
        },
        createPost(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author);

            if (!userExists) {
                throw new Error('User not found.');
            }

            const post = {
                id: uuidv4(),
                ...args.data
            };

            posts.push(post);

            return post;
        },
        deletePost(parent, args, ctx, info) {
            const postIndex = posts.findIndex((post) => post.id === args.id);

            if (postIndex === -1) {
                throw new Error('Post not found.');
            }

            const deletedPosts = posts.splice(postIndex, 1);

            comments = comments.filter((comment) => comment.post !== args.id);

            return deletedPosts[0];
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some((user) => user.id === args.data.author);
            const postExists = posts.some((post) => post.id === args.data.post && post.published);

            if (!userExists) {
                throw new Error('User not found.');
            }

            if (!postExists) {
                throw new Error('Post not found.');
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            };

            comments.push(comment);

            return comment;
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex((comment) => comment.id === args.id);

            if (commentIndex === -1) {
                throw new Error('Comment not found.');
            }

            const deletedComment = comments.splice(commentIndex, 1);

            return deletedComment[0];
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