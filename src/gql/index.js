import { makeExecutableSchema } from "apollo-server";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

import {
  typeDef as Book,
  resolvers as bookResolvers,
} from './book.js';

import { 
  typeDef as Comment,
  resolvers as commentResolver
} from "./comment";

const InitialSchema = `
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }
`;

const resolvers = {};

export default makeExecutableSchema({
  typeDefs: mergeTypeDefs([
    InitialSchema,
    Book,
    Comment
  ]),
  resolvers: mergeResolvers([
    Object.assign({}, null),
    bookResolvers,
    commentResolver
  ]),
});