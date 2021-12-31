import * as express from "express";
import User from "../db/models/user";

var router = express.Router();

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
