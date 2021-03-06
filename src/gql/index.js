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

import { 
  typeDef as Vote,
  resolvers as voteResolver
} from "./vote";

import { 
  typeDef as suggestBook,
  resolvers as suggestBookResolver
 } from "./suggestedBook";

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


export default makeExecutableSchema({
  typeDefs: mergeTypeDefs([
    InitialSchema,
    Book,
    Comment,
    Vote,
    suggestBook,
  ]),
  resolvers: mergeResolvers([
    Object.assign({}, null),
    bookResolvers,
    commentResolver,
    voteResolver,
    suggestBookResolver
  ]),
});