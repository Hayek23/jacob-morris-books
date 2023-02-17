const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
      
              return userData;
            }
      
            throw new AuthenticationError('Please log in...');
          },
        },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args)
            const token = signToken(user);
            return {token, user}
        },
        login: async (parent, {email, password}) => {
            const user = await user.findOne({email});

            if (!user) {
                throw new AuthenticationError('no user');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect password')
            }

            const token = signToken(user);
            return { token, user}
        },
        saveBook: async (parent, BookInput, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                  { _id: context.user._id },
                  { $push: { savedBooks: BookInput } },
                  { new: true }
                );
        
                return updatedUser;
              }
            throw new AuthenticationError('log in');
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                  );
            }
            throw new AuthenticationError('log in')
        }
    }
};

module.exports = resolvers