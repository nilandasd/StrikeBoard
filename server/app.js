require("dotenv").config({path: './private/.env'});
const path = require("path");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const server = require("https");
const cookies = require("cookie-parser");
const fs = require("fs");
const morgan = require('morgan')
const PORT = process.env.PORT || 4000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
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

app.use("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//SELF SIGNED!
server.createServer({
  key: fs.readFileSync('./private/key.pem', 'utf8'),
  cert: fs.readFileSync('./private/server.crt', 'utf8')
  }, app
).listen(PORT, () => console.log(`server listening on port: ${PORT}`));