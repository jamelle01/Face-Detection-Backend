const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 4044;

app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(port, () => {
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

Promise.all([
  // load all the models first before anything
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  fetchWorkouts(),
])

async function loadLabeledImages() {
  const labels = await User.map((user) => {
    return user.username;
  }); 

  console.log(labels);

  try {
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        // for (let i = 1; i <= 1; i++) {
        const img = await faceapi.fetchImage(
          `https://res.cloudinary.com/durortebu/image/upload/v1/photos/${label}/1.jpg`
        );
        console.log(
          `https://res.cloudinary.com/durortebu/image/upload/v1/photos/${label}/1.jpg`
        );
        // text += label+"\n";
        // document.getElementById('text').innerHTML= text;
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        c('prob')
        descriptions.push(detections.descriptor);

        c("check images");
        // }
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  } catch (err) {
    console.log(err);
  }
}

// get all user
app.get("/", async (req, res) => {
  const users = await User.find({}).sort({ updatedAt: -1 });
  res.status(200).json(users);
});

app.get("/hello", async (req, res) => {
  const users = await User.find({username})
  res.status(200).json(users);
});

