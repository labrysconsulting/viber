'use strict';

const express = require('express');
const https = require('https');
const ViberBot = require('viber-bot').Bot;
const BotEvents = require('viber-bot').Events;

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Initialize your Viber bot here
const bot = new ViberBot({
    authToken: "516ee70b1ce7e6e8-2bd702010b81ab4a-e4ed1b19af2ed1c1",
    name: "EchoBot",
    avatar: "http://viber.com/avatar.jpg"
});

// Add error handling for bot event listeners
bot.on(BotEvents.MESSAGE_RECEIVED, async (message, response) => {
    try {
        // Simulate an asynchronous operation with a timeout
        await delay(2000); // Replace with your actual logic
        
        // Echo the message back to the client
        response.send(message);
    } catch (error) {
        console.error('Error handling message:', error);
        // Handle the error gracefully
    }
});

// Set up the Viber webhook middleware at the /viber/webhook path
app.use("/viber/webhook", bot.middleware());

// Viber will push messages sent to this URL. Web server should be internet-facing.
const webhookUrl = process.env.WEBHOOK_URL;

const httpsOptions = {
    key: "",
    cert: "",
    ca: ""
}; // Trusted SSL certification (not self-signed).

https.createServer(httpsOptions, app).listen(port, () => {
    console.log("Viber bot is listening on port", port);
});

// Helper function to simulate a delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
