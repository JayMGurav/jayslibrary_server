import dotenv from "dotenv";
dotenv.config();
import { ApolloServer, PubSub  } from 'apollo-server';

import schema from "./gql/index"
import mongoDBConnect from "./utils/mongoDBConnect";

import Book from "./models/Book";
import Comment from "./models/Comment"
import Vote from "./models/Vote";
import SuggestedBook from "./models/SuggestedBook";


mongoDBConnect({url:process.env.MONGODB_URI});
const pubsub = new PubSub();

const server = new ApolloServer({ 
  schema,
  cors:{
    origin: ["https://jayslibrary.netlify.app", "http://localhost:3000", "https://jayslibrary.herokuapp.com/"],
    credentials: true
  },
  subscriptions:{
    path: '/graphqlSubscriptions',
    keepAlive: 9000,
  },
  context: ({req }) => {
    let ip;
    if(req){
      ip = req.headers['x-forwarded-for'] || req.headers['Remote_Addr'] || req.socket.remoteAddress;
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
        Vote,
        pubsub,
        SuggestedBook,
        ip
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
server.listen({ port: process.env.PORT || 4000 }).then(({ url, subscriptionsUrl }) => {
  console.log(`🚀  Server ready at ${url}`);
  console.log(`🚀  Subscriptions Server ready at ${subscriptionsUrl}`);
});