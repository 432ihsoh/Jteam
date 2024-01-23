'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 3000;

const config = {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
    if(req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff'){
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return; 
    }

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = event.message.text.toLowerCase(); // ユーザーのメッセージを小文字に変換

  // 特定のキーワードに応じて返信文を変更
  if (userMessage.includes('観光地を探す')) {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'はい、観光地をお探しですね？',
    });
  }

  // 他に一致するキーワードがない場合、デフォルトのオウム返し
  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text, // オウム返し
  });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);

