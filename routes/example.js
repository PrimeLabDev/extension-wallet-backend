var express = require('express');
const AWS = require("aws-sdk");

var router = express.Router();

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

router.get("/users", async function (req, res) {
    const params = {
        TableName: USERS_TABLE,
    };

    try {
        const { Items } = await dynamoDbClient.scan(params).promise();
        console.info({ Items })
        res.json(Items);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not retreive user" });
    }
});

router.get("/users/:userId", async function (req, res) {
    const params = {
        TableName: USERS_TABLE,
        Key: {
            userId: req.params.userId,
        },
    };

    try {
        const { Item } = await dynamoDbClient.get(params).promise();
        if (Item) {
            const { userId, name } = Item;
            res.json({ userId, name });
        } else {
            res
                .status(404)
                .json({ error: 'Could not find user with provided "userId"' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not retreive user" });
    }
});

router.post("/users", async function (req, res) {
    const { userId, name } = req.body;
    if (typeof userId !== "string") {
        res.status(400).json({ error: '"userId" must be a string' });
    } else if (typeof name !== "string") {
        res.status(400).json({ error: '"name" must be a string' });
    }

    const params = {
        TableName: USERS_TABLE,
        Item: {
            userId: userId,
            name: name,
        },
    };

    try {
        await dynamoDbClient.put(params).promise();
        res.json({ userId, name });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not create user" });
    }
});

module.exports = router;