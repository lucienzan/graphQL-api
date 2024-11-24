import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { typeDefs } from './schema.js';
import express from 'express';
import http from 'http';
import cors from 'cors';
import _db from './models/_db.js';
import { GraphQLScalarType } from 'graphql';

const app = express();
const httpServer = http.createServer(app);

const dateScaler = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scaler type",
  serialize(value) {
    if (value instanceof Date) {
      console.log(value)
      return value.getTime();
    }
    throw Error('GraphQL Date Scalar serializer expected a `Date` object');
  },
  parseValue(value) {
    if (typeof value === 'number') {
      return new Date(value);
    }
    throw new Error('GraphQL Date Scalar parser expected a `number`');
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});

const resolvers = {
  Date: dateScaler,
  Query: {
    authors: () => _db.authors(),
    author: (_, arg) => _db.authors().find((x) => x.id == arg.id),
    books: () => _db.books(),
    book: (_, arg) => _db.books().find((x) => x.id == arg.id)
  },
  Authors: {
    books: (parent) =>  _db.books().filter((x) => x.authorId == parent.id)
  },
  Books: {
    author: (parent) => _db.authors().find((x) => x.id == parent.id)
  },
  Mutation: {
    deleteAuthor: (_, arg) => _db.authors().filter((author) => author.id != arg.id),
    addAuthor: (_, arg) => {
      let author = {
        ...arg.author,
        id: _db.authors().length + 1
      };
      _db.authors().push(author);
      return author;
    },
    updateAuthor: (_, arg) => {
      const author = _db.authors().map((item) => {
        if (item.id == arg.id) {
          return { ...item, ...arg.edit }
        }
        return item;
      });
      _db.setAuthors(author);
      return _db.authors().find((a) => a.id == arg.id)
    }
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
