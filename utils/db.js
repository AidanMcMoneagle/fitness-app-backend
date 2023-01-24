const mongoose = require("mongoose");

const connectToDb = (app) => {
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.r1k7vjn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    )
    .then(() => {
      app.listen(process.env.PORT || 5000, () => {
        console.log("listening on port 5000");
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectToDb;
