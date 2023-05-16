const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

// Define the port to run the server on
const PORT = process.env.PORT || 3001;

// Create a new Apollo Server instance with the type definitions, resolvers, and auth context middleware
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Create an Express application
const app = express();

// Define the middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

// Define an async function to start the server
const startServer = async () => {
  try {
    // Connect to the database
    await db.once('open', () => console.log('Connected to the database.'));

    // Start the Apollo Server
    await server.start();

    // Apply Apollo Server as a middleware to Express
    server.applyMiddleware({ app });

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🚀 GraphQL Playground available at http://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (err) {
    console.error(`Error starting server: ${err}`);
  }
};

// Call the startServer function to start the server
startServer();