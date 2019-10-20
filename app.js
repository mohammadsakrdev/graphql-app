import { GraphQLServer } from 'graphql-yoga';

const users = [
  { id: '12qw', name: 'Mohammad', mail: 'mail@yahoo.com', age: 12 },
  { id: '12qwwe', name: 'Mohammad1', mail: 'mail1@yahoo.com', age: 15 },
  { id: '12qwwye', name: 'Mohammad2', mail: 'mail11@yahoo.com', age: 25 }
];

// Type definitions
const typeDefs = `
  type Query {
    users(query: String): [User!]!
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
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parents, args, ctx, info) {
      return users;
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
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log('Server is running');
});
