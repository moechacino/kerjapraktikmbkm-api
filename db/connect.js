const mongoose = require("mongoose");
const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = { connectDB };
/*
mongoose.connection.db.listCollections().toArray((err, collections) => {
    if (err) {
      console.error(err);
      return;
    }

    collections.forEach((collection) => {
      if (collection.name === "NIP") {
        
      }
    });
  });
*/
