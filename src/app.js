require("dotenv").config();
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const cookieparser = require("cookie-parser");
const socketHandler = require("./socket/soket");

const app = express();
app.set("trust proxy", 1);

app.use(express.json());
app.use(cookieparser());

const authrouter = require("./Router/auth");
const profilerouter = require("./Router/profile");
const requestrooter = require("./Router/request");
const userrooter = require("./Router/user");
const paymentrouter = require("./Router/payment");
const cors = require("cors");
const chatRouter = require("./Router/chat");

const allowedOrigins = [
  "http://localhost:5173",
  "https://dev-connect-ui-6gyv.vercel.app",
];
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://dev-connect-ui-6gyv.vercel.app"],
    credentials: true,
  },
});

socketHandler(io);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options(/.*/, cors());

app.use("/", authrouter);
app.use("/", profilerouter);
app.use("/", requestrooter);
app.use("/", userrooter);
app.use("/", paymentrouter);
app.use("/chat", chatRouter);
connectDB()
  .then(() => {
    console.log("database connection established");

    const PORT = process.env.PORT || 3000;

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
