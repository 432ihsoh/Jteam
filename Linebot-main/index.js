const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');

const config = {
  channelSecret: 'ac937acd718f9a9ff363c34a67f1ab14',
  channelAccessToken: 'd7vihyn65H8YdCzTyLajxPzqPFtn0PwmWGZn/b1qDHS8edMEbW6YvhP5mUXVRQ5CkAOyvJrvjIM9nSel3taXxcrS/fGzvD47hnp1BXjxQfnUBcbMCrFbojIrW3KMrPs1NTFeDkbELdGazDSMGd/RowdB04t89/1O/w1cDnyilFU=',
};

const client = new Client(config);

const app = express();

app.use(express.json());

app.post('/v2/bot/channel/webhook/test', middleware(config), (req, res) => {
  const event = req.body.events[0];
  if (event.type === 'message' && event.message.type === 'text') {
    handleText(event);
  }
  res.sendStatus(200);
});

function handleText(event) {
  const message = {
    type: 'text',
    text: `You said: ${event.message.text}`,
  };
  client.replyMessage(event.replyToken, message);
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});