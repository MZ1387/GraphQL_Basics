export default {
    users(parent, args, { db }, info) {
        if (!args.query) {
            return db.users;
        }

        return db.users.filter((user) => {
            return user.name.toLowerCase().includes(args.query.toLowerCase());
        })
    },
    posts(parent, args, { db }, info) {
        if (!args.query) {
            return db.posts;
        }

        return db.posts.filter((post) => {
            const titleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
            const bodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
            return titleMatch || bodyMatch;
        })
    },
    comments(parent, args, { db }, info) {
        return db.comments;
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
};