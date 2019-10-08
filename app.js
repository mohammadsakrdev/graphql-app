import { GraphQLServer } from 'graphql-yoga';

// Type definitions
const typeDefs = `
  type Query {
    hello: String!
    name: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return 'this is my first query';
    },
    name() {
      return 'My name is mohammad';
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log('Server is running');
});
