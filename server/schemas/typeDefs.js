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
    singleUser(userId: ID!): User
  }

  type Mutation {
    createUser(username: String!, email: String!): Auth
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
    removeBook(Id: String!): User    
  }
`;

module.exports = typeDefs;