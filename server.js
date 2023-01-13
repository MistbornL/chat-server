require("dotenv").config(); // load .env variables
const express = require("express"); // import express
const { log } = require("mercedlogger"); // import mercedlogger's log function
const cors = require("cors"); // import cors
const http = require("http");
const { Server } = require("socket.io");
// const UserRoutes = require("./controllers/userController"); //import User Routes
const Users = require("./routes/userRoutes");
// const CollectionRoutes = require("./routes/collectionRoutes");
// const TagRoutes = require("./routes/tagRoutes");

//DESTRUCTURE ENV VARIABLES WITH DEFAULT VALUES

const PORT = process.env.PORT || 5000;
const SOCKET_PORT = process.env.SOCKET_PORT || 5001;

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("this is the test route to make sure server is working");
});

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    console.log(data);
    socket.join(data.room);
    socket.to(data.room).emit("receive_joining", data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

app.use("/users", Users);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
server.listen(SOCKET_PORT, () =>
  console.log(`Server running on port ${SOCKET_PORT}`)
);
