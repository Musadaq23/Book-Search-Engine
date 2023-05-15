const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');


// Create the functions that fulfill the queries defined in `typeDefs.js`
const resolvers = {
  Query: {
    singleUser: async (parent, { userId }) => {
      return User.findOne({ _id: userId });
    },
  },

  Mutation: {
    createUser: async (parent, { username, email }) => {
      const user = await User.create({ username, email });
      const token = signToken(user);

      return { token, user };
    },

    login: async (parent, { username, email }) => {
      const user = await User.findOne({ $or: [{ username: username }, { email: email }] });
      if (!user) {
        throw new AuthenticationError('No user with this username or email found!');
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { body }, context) => {
      if (context.user) {
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: body } },
            { new: true, runValidators: true }
          );
          return updatedUser;
        } catch (err) {
          console.log(err);
        }
      } else {
        throw new AuthenticationError('You must be logged in to perform this action!');
      }
    },

    deleteBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        if (!updatedUser) {
          console.log("Couldn't find user with this id!");
        }
        return updatedUser;
      } else {
        throw new AuthenticationError('You must be logged in to perform this action!');
      }
    },
  },
};

module.exports = resolvers;