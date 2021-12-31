import * as express from "express";
import * as dynamoose from "dynamoose";

var router = express.Router();
// const dynamoDbClient = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE || "";
const UserSchema = new dynamoose.Schema({ userId: String, name: String });
const User = dynamoose.model(USERS_TABLE, UserSchema);

router.get("/users", async function (req, res) {
  try {
    const users = await User.scan().exec();
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get("/users/:userId", async function (req, res) {
  try {
    const user = await User.get(req.params.userId);
    console.info({ user });
    res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Could not retreive user" });
  }
});

router.post("/users", async function (req, res) {
  const { userId, name } = req.body;
  if (typeof userId !== "string") {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== "string") {
    res.status(400).json({ error: '"name" must be a string' });
  }

  try {
    const newUser = await User.create({ userId, name });
    res.json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Could not create user" });
  }
});

module.exports = router;
