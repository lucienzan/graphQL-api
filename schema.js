export const typeDefs = `#graphql
  scalar Date

  type Authors{
  id: ID!,
  firstName: String!,
  lastName: String,
  email: String!,
  password: String!,
  bio: String,
  address: String,
  books: [Books!]
  }

  type Books{
  id: ID!,
  title: String!,
  description: String,
  publishDate: Date!,
  author: Authors!,
  price: String,
  genre: String
  }

  type Query {
    authors: [Authors]
    author(id: ID!): Authors,
    books: [Books],
    book(id: ID!): Books
  }

  type Mutation {
    deleteAuthor(id: ID!):[Authors],
    addAuthor(author: AuthorFields): Authors,
    updateAuthor(id: ID!, edit: editAuthor!): Authors
  }

  input AuthorFields {
    firstName: String,
    lastName: String,
    email: String!,
    password: String!,
    bio: String,
    address: String
  }

  input editAuthor {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    bio: String,
    address: String
  }
`;
