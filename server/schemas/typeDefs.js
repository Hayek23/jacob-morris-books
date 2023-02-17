const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedBooks: [Book]
    }

    type Book {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }

    type Auth {
        token: ID
        user: User
    }

    input BookInput {
        bookId: String
        title: String
        authors: [String]
        link: String
        description: String
        image: String
    }

    type Query{
        me: User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(BookInput: BookInput): User
        removeVook(bookId: String!): User
    }
`

module.export = typeDefs