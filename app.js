require('dotenv').config();
const path = require("path");
const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require('cors');
const apiRouter = require('./api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Balling ⛹🏾‍♂️ on port ${PORT} 🪐`);
});
