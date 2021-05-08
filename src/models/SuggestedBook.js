import mongoose from 'mongoose';

const suggestedBookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Book title is required!"],
    unique: [true, "Suggested book title should be unique!"]
  },
  author: {
    type: String,
    required: [true, "Book author is required!"]
  }
},
{ timestamps: true })

const SuggestedBook = mongoose.model('suggestedBook', suggestedBookSchema);
export default SuggestedBook;