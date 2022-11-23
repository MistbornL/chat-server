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
const { PORT = 5000 } = process.env;

// Create Application Object
const app = express();

// GLOBAL MIDDLEWARE
app.use(cors()); // add cors headers
app.use(express.json()); // parse json bodies

app.get("/", (req, res) => {
  res.send("this is the test route to make sure server is working");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

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
// app.use("/collection", CollectionRoutes);
// app.use("/user", UserRoutes);
// app.use("/tag", TagRoutes);

// APP LISTENER
app.listen(PORT, () => log.green("SERVER STATUS", `Listening on port ${PORT}`));
