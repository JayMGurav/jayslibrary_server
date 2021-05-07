import { gql } from "apollo-server";

export const typeDef = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    info: String
    caption: String
    cover: String
    comments: [Comment!]
    stared: Boolean!
    voteCount: Int!
    votes: [ID!]
  }

  input AddBookInput {
    title: String!,
    author: String!
    info: String
    isbn: String
    cover: String
  }

  extend type Query {
    book(id: ID!): Book!
    books: [Book!]
  }
  
  extend type Mutation {
    addBook(input: AddBookInput!): Book!
  }
`;

export const resolvers = {
  // Book queries
  Book: {
    comments:  async (parent, _args, { Comment }, _info) => {      
      const bookComments = await Comment.find(
        {book: parent.id},
      ).sort({ createdAt: -1 }).exec();
      return bookComments;
    }
    
  },
  Query: {
     book: async (_parent, { id }, { Book }, _info) => {
      try {
        return await Book.findById(id).exec();
      } catch (error) {
        throw new Error("Error getting book: ", error.message);
      }
    },
    books: async (_parent, _args, { Book }, _info) => {
      try {
        return await Book.find({}).exec();
      } catch (error) {
        throw new Error("Error getting books: "+ error.message);
      }
    },
  },
  // Book mutations
  Mutation: {
    addBook: async (_parent, { input }, { Book }, _info) => {
      try {
        return await Book.create({
          ...input
        }); 
      } catch (error) {
        throw new Error("Error adding book: "+ error.message);
      }
    },
  }

};