const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
const OracleBot = require('@oracle/bots-node-sdk');
'use strict';

const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const {
    WebhookClient,
    WebhookEvent
} = OracleBot.Middleware;

require('dotenv').config();

const app = express().use(body_parser.json());
OracleBot.init(app);

const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN; // Ansh_token
let viberUserId;
let viberSender;

// Add webhook integration to Oracle Cloud
const webhook = new WebhookClient({
    channel: {
        url: 'https://chatapi.viber.com/pa/set_webhook',
        secret: '516ee70b1ce7e6e8-2bd702010b81ab4a-e4ed1b19af2ed1c1'
    }
});

webhook
    .on(WebhookEvent.ERROR, err => console.log('Viber Webhook Error:', err.message))
    .on(WebhookEvent.MESSAGE_SENT, message => console.log('Viber Message to chatbot:', message));

app.post('/bot/message', webhook.receiver()); // Receive bot messages

app.listen(process.env.PORT, () => {
    console.log("Hi your Webhook is listening");
});

webhook.on(WebhookEvent.MESSAGE_RECEIVED, receivedMessage => {
    console.log('Received a message from Viber, processing message before sending to ODA.');

    const text = receivedMessage.messagePayload.text;
    const viberUserId = receivedMessage.messagePayload.from.id;

    // Sending message from Viber to ODA
    const MessageModel = webhook.MessageModel();
    const message = {
        userId: viberUserId,
        messagePayload: MessageModel.textConversationMessage(text)
    };

    webhook.send(message);
});

// Your existing /webhook endpoint for verifying the callback URL remains the same

// Your existing /webhook POST endpoint for handling Viber messages needs to be adapted
app.post("/webhook", (req, res) => {
    let body_param = req.body;
    console.log(JSON.stringify(body_param, null, 2));

    if (body_param.event === "message") {
        const viberUserId = body_param.sender.id;
        const text = body_param.message.text;

        // Sending message from Viber to ODA
        const MessageModel = webhook.MessageModel();
        const message = {
            userId: viberUserId,
            messagePayload: MessageModel.textConversationMessage(text)
        };

        webhook.send(message);
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});
app.get("/", (req, res) => {
    res.status(200).send("Hello Ansh this is webhook setup");
});

// Your existing / GET endpoint remains the same
