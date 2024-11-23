export const typeDefs = `#graphql
  type Authors{
  id: ID!,
  firstName: String!,
  lastName: String,
  email: String!,
  password: String!,
  bio: String,
  address: String
  }

  type Query {
    authors: [Authors]
    author(id: ID!): Authors
  }
`;
