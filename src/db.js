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

export default {
    users, 
    posts, 
    comments
};