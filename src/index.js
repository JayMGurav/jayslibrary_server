import dotenv from "dotenv";
dotenv.config();
import { ApolloServer, PubSub  } from 'apollo-server';

import schema from "./gql/index"
import mongoDBConnect from "./utils/mongoDBConnect";
import Book from "./models/Book";
import Comment from "./models/Comment"

mongoDBConnect({url:process.env.MONGODB_URI});
const pubsub = new PubSub();

const server = new ApolloServer({ 
  schema,
  context: ({req, res, connection }) => {
    if(req){
      const ip =req.headers['x-forwarded-for'] || req.socket.remoteAddress
      console.log({ip});
    }

    // if (connection) {
    //   return {
    //     Book,
    //     Comment,
    //     pubsub
    //   };
    // }else{ 
      return {
        Book,
        Comment,
        pubsub
      };
    // }
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