const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 4044; // where the server run
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

// get all user
app.get("/", async (req, res) => {
  const users = await User.find({}).sort({ updatedAt: -1 });
  res.status(200).json(users);
});

app.post("/post", async (req, res) => {
  const { clientMac, apMac, ssidName, radioId } = req.body;
  console.log("suc");
  const authInfo = {
    clientMac: clientMac,
    apMac: apMac,
    ssidName: ssidName,
    radioId: radioId,
    authType: 4,
  };
  // const csrfToken = getCSRFToken();

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    // "Csrf-Token": csrfToken,
  };

  const xhr = new XMLHttpRequest();
  console.log("hey");

  const CONTROLLER = "192.168.0.120";
  const PORT = "8043";
  const CONTROLLER_ID = "d671bed58e54a1444a37eef63f5fb6f8";

  // post
  xhr.open(
    "POST",
    `https://${CONTROLLER}:${PORT}/${CONTROLLER_ID}/api/v2/hotspot/login`
  );

  // Set return to a value, not return to page
  xhr.responseType = "text";

  // Set up cookies.
  xhr.withCredentials = true;

  // Allow Self Signed Certs
  xhr.rejectUnauthorized = false;

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  // xhr.setRequestHeader("Csrf-Token", csrfToken);

  // API Call
  await xhr.send(JSON.stringify(authInfo));

  xhr.addEventListener("load", () => {
    const xhrRes = xhr.responseText;

    console.log(xhrRes);
    const resObj = JSON.parse(xhrRes);

    if (resObj.errorCode === 0) {
      // authorized successfully
      res.status(200).json({ message: "success" });
    } else {
      // authorization failed
      res.send({ message: "failure" });
    }
  });
});

app.post("/post1", async (req, res) => {
  const loginInfo = {
    name: "tplink",
    password: "tplink",
  };

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const xhr = new XMLHttpRequest();

  xhr.rejectUnauthorized = false;

  xhr.addEventListener("load", () => {
    const resObj = JSON.parse(xhr.responseText);

    if (resObj.errorCode === 0) {
      // setCSRFToken(resObj.result.token);
    }
  });

  const CONTROLLER = "192.168.0.120";
  const PORT = "8043";
  const CONTROLLER_ID = "d671bed58e54a1444a37eef63f5fb6f8";

  xhr.open(
    "POST",
    `https://${CONTROLLER}:${PORT}/${CONTROLLER_ID}/api/v2/hotspot/login`
  );

  Object.entries(headers).forEach(([key, value]) =>
    xhr.setRequestHeader(key, value)
  );

  xhr.send(JSON.stringify(loginInfo));

  function setCSRFToken(token) {
    const fs = new FileSystem();

    const file = fs.openFile(TOKEN_FILE_PATH, { create: true });
    if (!file) {
      console.error("Unable to open file!");
      return;
    }

    file.write(token);

    file.close();

    return token;
  }
});

app.post("/ff", async (req, res) => {
  console.log("suc");
  res.send({ message: "success" });
});

// function getCSRFToken() {
//   const fs = new FileSystem();
//   const file = fs.openFile(TOKEN_FILE_PATH, { create: true });
//   if (!file) {
//     console.error("Unable to open file!");
//     return;
//   }
//   const token = file.read();
//   file.close();
//   return token;
// }
