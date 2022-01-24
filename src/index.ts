import * as express from "express";
import * as serverless from "serverless-http";
import * as routes from "./api/routes";
import * as dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use("", routes as any);

app.use((req: express.Request, res: express.Response) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
