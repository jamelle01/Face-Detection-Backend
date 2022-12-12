const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const cors = require("cors");
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db and listening on port 4001!!!");
    });
  })
  .catch((error) => {
    console.log("sheessh, " + error);
  });

// schema of db
const userSchema = {
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
};

const User = mongoose.model("User", userSchema);

// get all user
app.get("/", async (req, res) => {
  const users = await User.find({}).sort({ updatedAt: -1 });

  res.status(200).json(users);
});
