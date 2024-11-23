import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { typeDefs } from './schema.js';
import express from 'express';
import http from 'http';
import cors from 'cors';
import _db from './models/_db.js';

const app = express();
const httpServer = http.createServer(app);

const resolvers = {
  Query: {
    authors: () => _db.authors(),
    author: (_, arg) => _db.authors().find((x) => x.id == arg.id)
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

app.use(
  '/graphql',
  cors({ origin: ['https://www.your-app.example', 'https://studio.apollographql.com'] }),  // Correct usage of CORS
  express.json(),  // Middleware to parse JSON request bodies
  expressMiddleware(server),  // Apollo Server middleware for GraphQL
);

// Start the server
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log('HTTP Server is running at http://localhost:4000');
