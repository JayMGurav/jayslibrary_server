import { gql } from "apollo-server";

const BOOK_UPVOTED = 'BOOK_UPVOTED';


export const typeDef = gql`
  type Vote {
    id: ID!
    bookId: ID!  
  }

  extend type Subscription {
    bookUpvoted: Book!
  }
  
  extend type Query {
    vote(id: ID!): Vote!
    votes: [Vote!]
  }
  
  extend type Mutation {
    voteBook(bookId: ID!): Boolean!
  }
`;

export const resolvers = {
  // Book queries
  // Book: {
  //   comments:  async (parent, _args, { Comment }, _info) => {      
     
  //   }
    
  // },
     
  // Vote Subscriptions 
  Subscription: {
    bookUpvoted: {
      subscribe: (_parent, _args, {pubsub}) =>    pubsub.asyncIterator([BOOK_UPVOTED]),
    },
  },
  Query: {
     vote: async (_parent, { id }, { Vote }, _info) => {
      try {
        return Vote.findById(id).exec(); 
      } catch (error) {
        throw new Error("Error getting vote: " + error.message);
      }
    },
    votes: async (_parent, _args, { Vote }, _info) => {
      try {
        return Vote.find({}).exec(); 
      } catch (error) {
        throw new Error("Error getting votes: " + error.message);
      }
    },
  },
  // Book mutations
  Mutation: {
    voteBook: async (_parent, { bookId }, { Vote, Book, ip,  pubsub }, _info) => {      
      try {
        const vote = await Vote.findOne({
         $and: [
            { bookId },
            { ip }
          ]
        }).exec();
        
        if(Boolean(vote)){
          throw new Error(`You have already voted for this Book`)
        }
        
        const newVote =  await Vote.create({
          bookId,
          ip
        });
        
        const updatedBook = await Book.findByIdAndUpdate(
          bookId,
          {
            $inc: {voteCount: 1},
            $addToSet: { votes: newVote.id }
          },
          {new: true}
        )
        const voted = Boolean(newVote) && Boolean(updatedBook)
        if(voted){
          pubsub.publish(BOOK_UPVOTED, {
            bookUpvoted: updatedBook
          });   
        }
        return voted;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  }

};