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

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)'));
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

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

const travelData = JSON.parse(fs.readFileSync('./Travel/kannkouti/traval.json', 'utf8'));

// ユーザーごとの回答状態を保持するオブジェクト
// ユーザーごとの回答状態を保持するオブジェクト
let userState = {};

async function handleEvent(event) {
    // 以前の回答状態を取得するか、初期化する
    const currentState = userState[event.source.userId] || { step: 0 };

    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    const userMessage = event.message.text.toLowerCase();

    // 現在のステップに基づいて処理を分岐
    switch (currentState.step) {
        case 0:
            if (userMessage === '観光地を探す') {
                // 質問に対する処理
                const questionText = '観光地をお探しですね。ではこれからいくつかの質問をしていきます。\n自然は好きですか？（はい／いいえ）';
                // ステップを進める
                currentState.step = 1;
                // ユーザーに質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: questionText
                });
            }
            break;
        case 1:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const responseText = '素晴らしいです！自然が好きな方にはたくさんの観光地がありますね。';
                // ステップを進める
                currentState.step = 2;
                // ユーザーに回答を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: responseText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = 'そうですか、温泉は好きですか？（はい／いいえ）';
                // ステップを進める
                currentState.step = 3;
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            }
            break;
        // 他のステップに対する処理を追加できます
    }

    // ユーザーの回答状態を更新
    userState[event.source.userId] = currentState;

    return Promise.resolve(null);
}


app.listen(PORT);
console.log(`Server running at ${PORT}`);
