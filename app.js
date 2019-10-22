import { GraphQLServer } from 'graphql-yoga';

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

// Type definitions
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    greeting(name: String, position: String): String!
    add(numbers: [Float!]!): Float!
    me: User!
    grades: [Int!]!
  }

  type User {
    id: ID!
    name: String!
    mail: String
    age: Int!
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

// Resolvers
const resolvers = {
  Query: {
    users(parents, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parents, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        return post.title.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    comments(parents, args, ctx, info) {
      return comments;
    },
    add(parents, args, ctx, info) {
      if (args.numbers.length === 0) {
        return 0;
      }
      return args.numbers.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
    },
    greeting(parent, args, ctx, info) {
      if (args.name && args.position) {
        return `Hello! ${args.name}, you are ${args.position}`;
      }
      console.log(args);
      return 'Hello!';
    },
    me() {
      return {
        id: '123asd',
        name: 'mohammad',
        mail: 'mail@yahoo.com',
        age: 12
      };
    },
    grades(parent, args, ctx, info) {
      return [12, 15, 23];
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log('Server is running');
});
