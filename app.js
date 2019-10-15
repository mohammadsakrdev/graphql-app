import { GraphQLServer } from 'graphql-yoga';

// Type definitions
const typeDefs = `
  type Query {
    greeting(name: String, position: String): String!
    me: User!
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
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log('Server is running');
});
