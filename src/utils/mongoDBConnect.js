import mongoose from "mongoose";


async function mongoDBConnect({url}) {
  try {
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useNewUrlParser: true
    });
    const db = mongoose.connection;
    db.once('open', function() {
      console.log(`connected at 🚀`)
    });
  } catch (error) {
    console.log("Error connecting MongoDB: ", error.message);
  }
}

export default mongoDBConnect;