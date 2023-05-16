const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Define which fields are accessible from the Class model

  type Book{
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }

  type User{
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }


  type Auth{
    token: ID!
    User: User
  }

  # Define which queries the front end is allowed to make and what data is returned
  type Query {
    me: [User]
  }

  type Mutation {
    login(email: String!, password: String!): Auth 
    addUser(username: String!, email: String!): Auth

    saveBook(
      authors: [String], 
      description: String!, 
      title: String!, 
      bookId: String!,
      image: String,
      link: String,
    ): User
    removeBook(bookId: String!): User    
  }
`;

module.exports = typeDefs;