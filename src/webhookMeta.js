export function metaVerify(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
}

export async function metaReceive(req, res) {
  console.log("Meta webhook event", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
}
