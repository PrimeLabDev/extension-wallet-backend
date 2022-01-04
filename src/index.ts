import * as express from "express";
import * as serverless from "serverless-http";
import * as registrationRoutes from "./api/routes/registration.route";

const app = express();

app.use(express.json());

app.use("/api", registrationRoutes);

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
