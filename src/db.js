const users = [
  { id: '1', name: 'Mohammad', mail: 'mail@yahoo.com', age: 12 },
  { id: '2', name: 'Ahmed', mail: 'mail1@yahoo.com', age: 15 },
  { id: '3', name: 'Mahmoud', mail: 'mail11@yahoo.com', age: 25 }
];

const posts = [
  {
    id: '1',
    title: 'Post 1',
    body: 'Post 1 body',
    published: true,
    author: '1'
  },
  {
    id: '2',
    title: 'Post 1',
    body: 'Post 1 body',
    published: true,
    author: '1'
  },
  {
    id: '3',
    title: 'Post 1',
    body: 'Post 1 body',
    published: false,
    author: '3'
  }
];

const comments = [
  {
    id: '1',
    text: 'text 1',
    author: '1',
    post: '1'
  },
  {
    id: '2',
    text: 'text 2',
    author: '1',
    post: '1'
  },
  {
    id: '3',
    text: 'text 3',
    author: '2',
    post: '2'
  },
  {
    id: '4',
    text: 'text 4',
    author: '2',
    post: '2'
  }
];

const db = {
  users,
  posts,
  comments
};

export { db as default };
