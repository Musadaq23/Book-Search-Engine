const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');


// Define the port to run the server on
const PORT = process.env.PORT || 3001;

// Create a new Apollo Server instance with the type definitions, resolvers and auth context middleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
});

// Create an Express application
const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Define the middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const startServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });

// Connect to the database and start the server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}${server.graphqlPath}`);
  });
});
}
startServer(typeDefs, resolvers);