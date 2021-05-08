import { gql } from "apollo-server";

export const typeDef = gql`
  type SuggestedBook {
    id: ID!
    title: String!
    author: String!
  }


  extend type Query {
    suggestedBook(id: ID!): SuggestedBook!
    suggestedBooks: [SuggestedBook!]
  }
  
  extend type Mutation {
    suggestBook(title: String!, author: String!): SuggestedBook!
  }
`;
 
export const resolvers = {
  // SuggestedBook queries
  Query: {
    suggestedBook: async (_parent, { id }, { SuggestedBook }, _info) => {
      try {
        return await SuggestedBook.findById(id).exec();
      } catch (error) {
        throw new Error("Error getting SuggestedBook: ", error.message);
      }
    },
    suggestedBooks: async (_parent, _args, { SuggestedBook }, _info) => {
      try {
        return await SuggestedBook.find({}).exec();
      } catch (error) {
        throw new Error("Error getting books: "+ error.message);
      }
    },
  },
  // SuggestedBook mutations
  Mutation: {
    suggestBook: async (_parent, { title, author }, { SuggestedBook }, _info) => {
      try {
        const isBookSuggested = await SuggestedBook.findOne({
          $and: [
            {title},
            {author}
          ]
        }).exec()        

        if(Boolean(isBookSuggested)){
          throw new Error(`"${title}" is already added on the suggested list`);
        }
        
        return await SuggestedBook.create({
          title,
          author
        }); 
      } catch (error) {
        throw new Error(error.message);
      }
    },
  }

};