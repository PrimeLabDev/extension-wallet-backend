import * as express from "express";
import * as serverless from "serverless-http";
import * as routes from "./api/routes";

const app = express();

app.use(express.json());

app.use("/api", routes);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
