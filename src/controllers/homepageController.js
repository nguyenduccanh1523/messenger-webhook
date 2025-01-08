import dotenv from "dotenv";
import axios from "axios";
dotenv.config();
// import homepageService from "../services/homepageService";
// import chatbotService from "../services/chatbotService";
// import templateMessage from "../services/templateMessage";

const MY_VERIFY_TOKEN = process.env.MY_VERIFY_TOKEN;
let messages = [];  

let getHomePage = (req, res) => {
    let facebookAppId = process.env.FACEBOOK_APP_ID;
    return res.render("homepage.ejs", {
        facebookAppId: facebookAppId
    })
};

let getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);

        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);
        }
    }
};

let postWebhook = (req, res) => {
    const body = req.body;

    if (body.object === "page") {
        body.entry.forEach(function (entry) {
            const senderId = entry.messaging[0].sender.id;
            const message = entry.messaging[0].message.text;
            let imageUrl = null;

            // Check if the message contains attachments
            if (entry.messaging[0].message.attachments) {
                entry.messaging[0].message.attachments.forEach(attachment => {
                    if (attachment.type === 'image') {
                        imageUrl = attachment.payload.url;
                    }
                });
            }

            console.log(`Sender ID: ${senderId}`);
            console.log(`Message: ${message}`);
            if (imageUrl) {
                console.log(`Image URL: ${imageUrl}`);
            }

            messages.push({
                senderId: senderId,
                message: message,
                imageUrl: imageUrl
            });

            // Send the message and image URL to n8n
            sendToN8n({ senderId, message, imageUrl });
        });

        res.status(200).send("EVENT_RECEIVED");
    } else {
        res.sendStatus(404);
    }
};

let getMessages = (req, res) => {
    res.json(messages)
}

let sendToN8n = (messagesData) => {
    const url = 'https://workflow.cloodo.com/webhook/4U0MYdkQXyKV45RF/webhook/facebook';
    axios.post(url, messagesData)
        .then(function (response) {
            console.log('Success:', response.data);
        })
        .catch(function (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        });
}


export {
    getHomePage,
    getWebhook,
    postWebhook,
    getMessages
};