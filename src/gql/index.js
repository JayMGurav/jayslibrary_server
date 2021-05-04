import { makeExecutableSchema } from "apollo-server";
import { mergeResolvers,mergeTypeDefs  } from "@graphql-tools/merge";

import { 
  typeDef as Book, 
  resolvers as bookResolvers,
} from './book.js'; 


const Query = `
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
  typeDefs: mergeTypeDefs([ Query, Book ]),
  resolvers: mergeResolvers([resolvers, bookResolvers]),
});