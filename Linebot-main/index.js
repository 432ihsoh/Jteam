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

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  // テキストメッセージを取得
  const receivedText = event.message.text;

  // '観光'という単語を検知
  if (receivedText.includes('観光')) {
    // 返信
    const replyText = '観光に行きたいんですね、いいですねー。私もつれてってください！';
    
    // LINEに返信
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: replyText
    });
  }

  // '観光'以外の場合はデフォルトの返信
  const defaultReply = '"観光"っておくれ';

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: defaultReply
  });
}



app.listen(PORT);
console.log(`Server running at ${PORT}`);