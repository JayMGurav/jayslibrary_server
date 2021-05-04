export const typeDef = `
  type Book {
    id: ID!
    title: String!
    author: String!
    info: String
    isbn: String
    cover: String
  }

  input AddBookInput {
    title: String!,
    author: String!
    info: String
    isbn: String
    cover: String
  }

  extend type Query {
    book(id: ID!): Book
    books: [Book!]
  }
  
  extend type Mutation {
    addBook(input: AddBookInput!): Boolean!
  }
`;

export const resolvers = {
  // Book queries
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
        throw new Error("Error getting books: ", error.message);
      }
    },
  },
  // Book mutations
  Mutation: {
    addBook: async (_parent, { input }, { Book }, _info) => {
      try {
        const book =  await Book.create({
          ...input
        }); 
        return Boolean(book);
      } catch (error) {
        throw new Error("Error adding book: ", error.message);
      }
    },
  }

};