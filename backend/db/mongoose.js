// MongoDB connection logic

const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose
  .connect("mongodb://localhost:27017/PCBUILD3R")
  .then(() => {
    console.log("Connected to MongoDB successfully...");
  })
  .catch((e) => {
    console.log("Error while attempting to connect to MongoDB");
    console.log(e);
  });

// To prevent deprectation warnings (from MongoDB native driver)
// mongoose.set("useCreateIndex", true);
// mongoose.set("useFindAndModify", false);

module.exports = {
  mongoose,
};
