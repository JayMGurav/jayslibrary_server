import { gql } from "apollo-server";

export const typeDef = gql`
  type Comment{
    id: ID!
    comment: String!
    book: Book!
    createdAt: String!
  }

  extend type Subscription {
    commentedCreated: Comment!
  }

  extend type Query {
    comment(id: ID!): Comment!    
  }
  
  extend type Mutation {
    addBookComment(comment: String!, bookId: ID!): Boolean!
  }
`;

export const resolvers = {
 
  Comment: {
    book: async (parent, _args, { Book }, _info) => {
      try{
        return await Book.findById(parent.book).exec();
      } catch (error) {
        throw new Error("Error getting book for comments: ", error.message);
      }
    }
  },
    // Comment Subscriptions 
  Subscription: {
    commentedCreated: {
      subscribe: (_parent, _args, {pubsub}) => pubsub.asyncIterator(['COMMENT_CREATED']),
    },
  },
    // Comment queries 
  Query: {
    comment: async (_parent, { id }, { Comment }, _info) => {
      try {
        return await Comment.findById(id).exec();
      } catch (error) {
        throw new Error("Error getting Comment: ", error.message);
      }
    },
  },
  // Comment mutations
  Mutation: {
    addBookComment: async (_parent, { comment, bookId }, { Comment, Book, pubsub }, _info) => {
      try {
        const addedComment =  await Comment.create({
          comment,
          book: bookId
        }); 

        let updateBook = null;
        if(addedComment){
          updateBook = await Book.findByIdAndUpdate(
            bookId,
            {
              $addToSet: { comments: addedComment.id }
            },
            {
              new: true
            }
          ); 
        }
        const isCommentCreated =  Boolean(addedComment) && Boolean(updateBook);
        if(isCommentCreated){
          pubsub.publish('COMMENT_CREATED', {
            commentedCreated: addedComment
          });          
        }
        return isCommentCreated;
      } catch (error) {
        throw new Error("Error adding comment: ", error.message);
      }
    }
  }
};