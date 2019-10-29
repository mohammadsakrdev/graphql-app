import { GraphQLServer } from 'graphql-yoga';
import db from './src/db';
import uuidv4 from 'uuid/v4';

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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = ctx.db.users.some(
        user => user.mail === args.data.mail
      );
      if (emailTaken) {
        throw new Error('Mail is used before');
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };

      ctx.db.users.push(user);
      return user;
    },
    createPost(parent, args, ctx, info) {
      const userExists = ctx.db.users.some(
        user => user.id === args.data.author
      );
      if (!userExists) {
        throw new Error('Author not found in users');
      }
      const post = {
        id: uuidv4(),
        ...args.data
      };
      ctx.db.posts.push(post);
      return post;
    },
    createComment(parent, args, ctx, info) {
      const userExists = ctx.db.users.some(
        user => user.id === args.data.author
      );
      if (!userExists) {
        throw new Error('Author not found in users');
      }

      const postExists = ctx.db.posts.some(post => post.id === args.data.post);
      if (!postExists) {
        throw new Error('Post not found in [posts]');
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      };

      ctx.db.comments.push(comment);
      return comment;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = ctx.db.users.findIndex(user => user.id === args.id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const deletedUsers = ctx.db.users.splice(userIndex, 1);
      posts = posts.filter(post => {
        const match = post.author === args.id;
        if (match) {
          ctx.db.comments = ctx.db.comments.filter(
            comment => comment.post !== post.id
          );
        }
        return !match;
      });
      ctx.db.comments = ctx.db.comments.filter(
        comment => comment.author !== args.id
      );
      return deletedUsers[0];
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = ctx.db.posts.findIndex(post => post.id === args.id);
      if (postIndex === -1) {
        throw new Error('Post not found');
      }
      const deletedPosts = ctx.db.posts.splice(postIndex, 1);
      ctx.db.comments = ctx.db.comments.filter(
        comment => comment.post !== args.id
      );
      return deletedPosts[0];
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = ctx.db.comments.findIndex(
        comment => comment.id === args.id
      );
      if (commentIndex === -1) {
        throw new Error('Comment not found');
      }
      const deletedComments = ctx.db.comments.splice(commentIndex, 1);
      ctx.db.comments = ctx.db.comments.filter(
        comment => comment.id !== args.id
      );
      return deletedComments[0];
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return ctx.db.users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return ctx.db.comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return ctx.db.posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return ctx.db.comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return ctx.db.users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return ctx.db.posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { db }
});

server.start(() => {
  console.log('Server is running');
});
