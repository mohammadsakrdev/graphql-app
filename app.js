import { GraphQLServer } from 'graphql-yoga';

// Type definitions
const typeDefs = `
  type Query {
    users: [User!]!
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
      return [
        { id: '12qw', name: 'Mohammad', mail: 'mail@yahoo.com', age: 12 },
        { id: '12qwwe', name: 'Mohammad 1', mail: 'mail1@yahoo.com', age: 13 }
      ];
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
