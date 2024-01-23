
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
const travelData = JSON.parse(fs.readFileSync('travel.json', 'utf8'));
 
async function handleEvent(event) {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
 
    const userMessage = event.message.text.toLowerCase();
 
   
if (userMessage === '観光地を探す') {
    // Ask the initial question
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: '観光地をお探しですね。ではこれからいくつかの質問をしていきます。\n自然は好きですか？（はい／いいえ）'
    });
} else if (userMessage === 'はい') {
    // Handle 'はい' response
    // You can ask more questions or provide information based on the user's response
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: '素晴らしいです！自然が好きな方にはたくさんの観光地がありますね。'
    });
} else if (userMessage === 'いいえ') {
    // Handle 'いいえ' response
    // You can ask different follow-up questions or provide information based on the user's response
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'そうですか、他にお好きなテーマはありますか？'
    });
} else {
    // Handle other responses
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: 'すみません、質問が理解できませんでした。はいかいいえで答えてください。'
    });
}
}
app.listen(PORT);
console.log(`Server running at ${PORT}`);
 


  


 
