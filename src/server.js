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
app.listen(port, () => console.log('Agent listening on :' + port));
