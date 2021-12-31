import * as express from "express";
import * as serverless from "serverless-http";
import * as exampleRoutes from "./routes/example";

const app = express();

app.use(express.json());

app.use("/example", exampleRoutes);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
