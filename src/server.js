import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import { metaVerify, metaReceive } from './webhookMeta.js';

const app = express();
app.use(bodyParser.json({ verify: (req, res, buf) => { req.rawBody = buf } }));

// Root route for testing
app.get('/', (req, res) => res.send('Social Agent OK'));

// Meta (Facebook/Instagram) webhook endpoints
app.get('/webhooks/meta', metaVerify);
app.post('/webhooks/meta', metaReceive);

// Start the server
const port = process.env.PORT || 3000;
const { google } = require("googleapis");

// Test route: writes one row to your Google Sheet
app.get("/test-log", async (req, res) => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID, // add this env var too!
      range: "Sheet1!A:D",
      valueInputOption: "RAW",
      requestBody: {
        values: [[new Date().toISOString(), "test", "ping", "ok"]],
      },
    });

    res.send("✅ Test log written to Google Sheet!");
  } catch (err) {
    console.error("Error writing to sheet:", err);
    res.status(500).send("❌ Failed to write to sheet");
  }
});

app.listen(port, () => console.log('Agent listening on :' + port));
