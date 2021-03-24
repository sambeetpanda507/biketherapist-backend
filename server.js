const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const db = require("./utils/db.js");
const authRouter = require("./routers/authRouter");
const postRouter = require("./routers/postRouter");
const bookingRouter = require("./routers/bookingRouter");
const paymentRouter = require("./routers/paymentRouter");

require("dotenv").config();

const port = process.env.PORT || 8081;
const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.BACKEND_URL,
  },
});

//middlewares
app.use(helmet());
app.use(cors({ origin: process.env.BACKEND_URL, credentials: true }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//routers
app.use("/api", authRouter);
app.use("/api", postRouter);
app.use("/api", bookingRouter);
app.use("/api", paymentRouter);

//socket connection
io.on("connection", (socket) => {
  socket.on("newBooking", (payload) => {
    socket.broadcast.emit("notification", payload);
  });
  //disconnect event
  socket.on("disconnect", () => {});
});

//connection with the database and listening to the server.
db.then((connection) => {
  if (connection) {
    console.log("connected to the database");
    server.listen(port, () => {
      console.log(`server is listening on port: https://localhost:${port}`);
    });
  }
}).catch((err) => {
  console.log(err);
});
