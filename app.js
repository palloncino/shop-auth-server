const path = require("path");
const cookieParser = require("cookie-parser");
const express = require("express");
const apiRouter = require('./api');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use('/api', apiRouter);

app.listen(3000, () => {
  console.log('listening on port 3000');
})

module.exports = app;