import uuidv4 from 'uuid/v4';
const Mutation = {
  createUser(parent, args, ctx, info) {
    const emailTaken = ctx.db.users.some(user => user.mail === args.data.mail);
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
  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find(user => user.id === id);
    if (!user) {
      throw new Error('User not found');
    }

    if (typeof data.mail === 'string') {
      const emailTaken = db.users.some(user => user.mail === data.mail);
      if (emailTaken) {
        throw new Error('Mail is used before');
      }

      user.mail = data.mail;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }
    return user;
  },
  createPost(parent, args, { db, pubSub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    if (!userExists) {
      throw new Error('Author not found in users');
    }
    const post = {
      id: uuidv4(),
      ...args.data
    };
    db.posts.push(post);
    if (args.data.published) {
      pubSub.publish('post', { post: { mutation: 'CREATED', data: post } });
    }
    return post;
  },
  deletePost(parent, args, { db, pubSub }, info) {
    const postIndex = db.posts.findIndex(post => post.id === args.id);
    if (postIndex === -1) {
      throw new Error('Post not found');
    }
    const [post] = db.posts.splice(postIndex, 1);
    db.comments = db.comments.filter(comment => comment.post !== args.id);

    if (post.published) {
      pubSub.publish('post', {
        post: { mutation: 'DELETED', data: post }
      });
    }
    return post;
  },
  updatePost(parent, args, { db, pubSub }, info) {
    const { id, data } = args;
    const post = db.posts.find(post => post.id === id);
    const originalPost = { ...post };
    if (post) {
      throw new Error('Post not found');
    }

    if (typeof data.text === 'string') {
      post.text = data.text;
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published;
      if (originalPost.published && !post.published) {
        pubSub.publish('post', {
          post: { mutation: 'DELETED', data: originalPost }
        });
      } else if (!originalPost.published && post.published) {
        pubSub.publish('post', {
          post: { mutation: 'CREATED', data: post }
        });
      }
    } else if (post.published) {
      pubSub.publish('post', {
        post: { mutation: 'UPDATED', data: post }
      });
    }
    return post;
  },
  createComment(parent, args, { db, pubSub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    if (!userExists) {
      throw new Error('Author not found in users');
    }

    const postExists = db.posts.some(post => post.id === args.data.post);
    if (!postExists) {
      throw new Error('Post not found in [posts]');
    }

    const comment = {
      id: uuidv4(),
      ...args.data
    };

    db.comments.push(comment);
    pubSub.publish(`comment ${args.data.post}`, {
      comment: { mutation: 'CREATED', data: comment }
    });
    return comment;
  },
  deleteComment(parent, args, { db, pubSub }, info) {
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );
    if (commentIndex === -1) {
      throw new Error('Comment not found');
    }
    const [deletedComment] = db.comments.splice(commentIndex, 1);
    db.comments = db.comments.filter(comment => comment.id !== args.id);
    pubSub.publish(`comment ${deletedComment.post}`, {
      comment: { mutation: 'DELETED', data: deletedComment }
    });
    return deletedComment;
  },
  updateComment(parent, args, { db, pubSub }, info) {
    const { id, data } = args;
    const comment = db.comments.find(comment => comment.id === id);
    if (comment) {
      throw new Error('Comment not found');
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    pubSub.publish(`comment ${comment.post}`, {
      comment: { mutation: 'UPDATED', data: comment }
    });
    return comment;
  }
};

export { Mutation as default };
