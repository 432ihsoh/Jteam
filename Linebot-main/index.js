
'use strict';
 
const express = require('express');
const line = require('@line/bot-sdk');
const fs = require('fs');
const PORT = process.env.PORT || 3000;
 
const config = {
    channelSecret: process.env.CHANNEL_SECRET,
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
};
 
const app = express();
 
app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); // ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
 
    // ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
    if (req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff') {
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return;
    }
 
    Promise
        .all(req.body.events.map(handleEvent))
        .then((result) => res.json(result));
});
 
const client = new line.Client(config);
 
// 観光地情報の読み込み
const travelData = JSON.parse(fs.readFileSync('./Linebot-main/Travel/kannkouti/traval.json', 'utf8'));
 
async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
 
    const userMessage = event.message.text.toLowerCase();
 
    if (userMessage === 'はい') {
        const randomIndex = Math.floor(Math.random() * travelData.length);
        const randomSpot = travelData[randomIndex].spot;
 
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: `おすすめの観光地は「${randomSpot}」です。楽しんでください！`
        });
    } else if (userMessage === 'いいえ') {
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: '他にも観光地をお探しでしょうか？（はい／いいえ）'
        });
    } else {
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: 'すみません、質問が理解できませんでした。はいかいいえで答えてください。'
        });
    }
}
 
app.listen(PORT);
console.log(`Server running at ${PORT}`);
 
