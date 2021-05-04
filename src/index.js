import dotenv from "dotenv";
dotenv.config();
import { ApolloServer } from 'apollo-server';

import schema from "./gql/index"
import mongoDBConnect from "./utils/mongoDBConnect";
import Book from "./models/Book";

mongoDBConnect({url:process.env.MONGODB_URI});

const server = new ApolloServer({ 
  schema,
  context: ({req, res}) => {
    return {
      Book
    };
  },
  introspection: true,
  playground: {
   settings: {
    'request.credentials': 'include',
   },
  }
});

// The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});