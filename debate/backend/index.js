const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = express.Router();
const jwt = require("jsonwebtoken");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const path = require("path");
let userRoute = require("./routes/user.route");
let debateRoute = require("./routes/debate.route");

mongoose.connect(
  "mongodb+srv://dds:dds123@cluster0-qxjv3.mongodb.net/debeate?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  (error, result) => {
    if (error) {
      console.log("error while connecting to db", error);
    } else {
      console.log("successfully connected with db");
    }
  }
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "uploads")));

router.use(function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers.token;

  if (token) {
    jwt.verify(token, "debate", function (err, decoded) {
      if (err) {
        return res.json({
          status: "err",
          success: false,
          message: "Failed to authenticate token.",
          data: null,
        });
      } else {
        if (decoded._doc) {
          req.user = decoded._doc;
          next();
        } else {
          req.user = decoded;
          next();
        }
      }
    });
  } else {
    return res.status(403).send({
      status: "err",
      success: false,
      message: "No token provided.",
      data: null,
    });
  }
});

app.use("/api", router);

app.use("/", userRoute);

app.use("/debate", debateRoute);

server.listen(8000, () => console.log("http server running on port 8000"));

io.on("connection", (socket) => {
  console.log("on connection..");
  if (!users[socket.id]) {
    users[socket.id] = socket.id;
  }

  socket.emit("senderId", socket.id);
  io.sockets.emit("receiverId", users);

  socket.on("disconnect", () => {
    delete users[socket.id];
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});
