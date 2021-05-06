import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Book title is required!"]
  },
  author: {
    type: String,
    required: [true, "Book author is required!"]
  },
  info: {
    type: String,
  },
  caption: {
    type: String,
  },
  cover: {
    type: String,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment'
  }],
  stared: {
    type: Boolean,
    default: false
  }
},
{ timestamps: true })

const Book = mongoose.model('book', bookSchema);
export default Book;