const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.static("."));
app.use(cors());

let path = require("path");
const server = http.createServer(app);
const io = new Server(server);
app.get("/", (req, res) => {
  res.send("hello world");
  // let filename = "index.html";
  // let options = {
  //   root: path.join(__dirname),
  // };
  // console.log(options);
  // res.sendFile(filename, options, (err) => {
  //   if (err) {
  //     console.log(err.message);
  //   } else {
  //     console.log("sent", filename);
  //   }
  // });
});

// const io = require("socket.io")(8000);
var users = {};
io.on("connection", (socket) => {
  console.log(" a user connected");
  socket.on("user-joined", (new_name) => {
    // console.log("newuser", new_name);
    users[socket.id] = new_name;
    socket.broadcast.emit("user-joined", new_name);
  });
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });
});
server.listen(8000, () => {
  console.log("express is on port no :", 8080);
});
