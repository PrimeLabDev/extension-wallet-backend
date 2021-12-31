const express = require("express");
const serverless = require("serverless-http");
const app = express();

var exampleRoutes = require('./routes/example');

app.use(express.json());

app.use('/example', exampleRoutes);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);
