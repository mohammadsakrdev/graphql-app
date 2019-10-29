const Query = {
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
};

export { Query as default };
