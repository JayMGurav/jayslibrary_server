import { gql } from "apollo-server";

const COMMENT_CREATED = 'COMMENT_CREATED';

export const typeDef = gql`
  type Comment{
    id: ID!
    comment: String!
    bookId: ID!
    createdAt: String!
  }

  extend type Subscription {
    commentedCreated: Book!
  }

  extend type Query {
    comment(id: ID!): Comment!    
  }
  
  extend type Mutation {
    addBookComment(comment: String!, bookId: ID!): Boolean!
    deleteComment(commentId: ID!, bookId: ID!): Boolean!
  }
`;

export const resolvers = {
 
  // Comment: {
    // book: async (parent, _args, { Book }, _info) => {
    //   try{
    //     return await Book.findById(parent.book).exec();
    //   } catch (error) {
    //     throw new Error("Error getting book for comments: " + error.message);
    //   }
    // }
  // },
    // Comment Subscriptions 
  Subscription: {
    commentedCreated: {
      subscribe: (_parent, _args, {pubsub}) => pubsub.asyncIterator([COMMENT_CREATED]),
    },
  },
    // Comment queries 
  Query: {
    comment: async (_parent, { id }, { Comment }, _info) => {
      try {
        return await Comment.findById(id).exec();
      } catch (error) {
        throw new Error("Error getting Comment: " + error.message);
      }
    },
  },
  // Comment mutations
  Mutation: {
    addBookComment: async (_parent, { comment, bookId }, { Comment, Book, pubsub, ip }, _info) => {
      try {
        const commentExists = await Comment.findOne({
          $and : [
            {ip},
            {bookId}
          ]
        }).exec();
        
        if(Boolean(commentExists)){
          throw new Error(`You have already commented for this Book`)
        }


        const addedComment = await Comment.create({
          comment,
          ip,
          bookId
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
          pubsub.publish(COMMENT_CREATED, {
            commentedCreated: updateBook
          });          
        }
        return isCommentCreated;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    deleteComment: async (_parent, { commentId, bookId }, { Comment, Book }, _info) => {
      try {
        const removedComment = await Comment.findByIdAndRemove(commentId);
        const updateBookDoc = await Book.findByIdAndUpdate(bookId, {$pull: {comments: commentId}}, {new:true});
        return Boolean(removedComment) && Boolean(updateBookDoc);
      }catch(error){
        throw new Error("Error deleting comment: "+ error.message);
      }
    } 
  }
};