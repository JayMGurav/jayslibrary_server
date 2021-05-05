import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "Comment is required!"]
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'book'
  }
},
{ timestamps: true })

const Comment = mongoose.model('comment', commentSchema);
export default Comment;