// custom_activity.js - Custom Activity Boilerplate for Genesys-SFMC integration

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request-promise-native");
const app = express();
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const GENESYS_AUTH_URL = "https://login.mec1.pure.cloud/oauth/token";
const GENESYS_CLIENT_ID = "a36298ab-fed3-428c-9d1f-86e99c982b63";
const GENESYS_CLIENT_SECRET = "tJL4zU-PQpV6BHI-owOChKzE5v8M9U0WkDRfbWcU0wY";
const GENESYS_MSG_URL = "https://api.mec1.pure.cloud/api/v2/flows/executions";

// Root route to confirm app is running
app.get('/', (req, res) => {
  res.send('SFMC Genesys Custom Activity server is running.');
});

// Serve config.json file
app.get('/config.json', (req, res) => {
    res.sendFile(path.join(__dirname, 'config.json'));
});

// Custom Activity UI Endpoints
app.get("/activity", (req, res) => {
  res.json({});
});

app.get("/save", (req, res) => {
  res.json({});
});

app.get("/publish", (req, res) => {
  res.json({});
});

app.post("/execute", async (req, res) => {
  try {
    // 1. Get Auth Token from Genesys
    const authResponse = await request.post({
      url: GENESYS_AUTH_URL,
      form: {
        client_id: GENESYS_CLIENT_ID,
        client_secret: GENESYS_CLIENT_SECRET,
        grant_type: "client_credentials",
      },
      json: true,
    });

    const accessToken = authResponse.access_token;
    
    res.send(`SFMC Genesys Custom Activity server is running.<br><br>Auth Token: <br><code>${accessToken}</code>`);
  } catch (err) {
    res.send('SFMC Genesys Custom Activity server is running.<br><br>Could not retrieve auth token.');
  }

    // 2. Send WhatsApp message trigger request
    const payload = {
      to: req.body.inArguments[0].to, // e.g., customer phone number
      message: req.body.inArguments[0].message,
    };

    const response = await request.post({
      url: GENESYS_MSG_URL,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    res.status(200).send("Success");
  } catch (err) {
    console.error("Error executing activity:", err);
    res.status(500).send("Failure");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
