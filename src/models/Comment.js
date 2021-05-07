import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, "Comment is required!"]
  },
  ip: {
    type: String,
    required: [true, "ip is required!"]
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'book'
  }
},
{ timestamps: true })

const Comment = mongoose.model('comment', commentSchema);
export default Comment;