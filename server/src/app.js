const path = require("path");
const express = require("express");
const cors = require("cors");
const server = require("https");
const cookies = require("cookie-parser");
const fs = require("fs");
const morgan = require('morgan')

require("dotenv").config();
const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: [
      `https://localhost:${PORT}`,
    ],
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(cookies());

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/user", userRoutes);
app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//SELF SIGNED!
server.createServer(
  {
    key: fs.readFileSync('key.pem', 'utf8'),
    cert: fs.readFileSync('server.crt', 'utf8')
  },
  app
).listen(PORT, () => console.log(`server listening on port: ${PORT}`));