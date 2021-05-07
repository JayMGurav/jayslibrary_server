import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: [true, "Vote ip required!"]
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'book'
  }
},
{ timestamps: true })

const Vote = mongoose.model('vote', voteSchema);
export default Vote;