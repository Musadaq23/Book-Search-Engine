const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Book {
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth 
    addUser(username: String!, email: String!): Auth
    saveBook(
      authors: [String], 
      description: String!, 
      title: String!, 
      id: String!,
      image: String,
      link: String
    ): User
    removeBook(id: String!): User    
  }
`;

module.exports = typeDefs;