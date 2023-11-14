//とりあえずのやつ
const axios = require('axios');

const ACCESS_TOKEN = '5OGPKxJkYCby13cZtwEj7GNS0xCglGSUkz3vt2+LXQCdUIxvoIAcFLjaDsKeJW2vMQrOwJRCMN/bGxvAe8wjeTuFMNCHiNKNHFOFNZl7FLJiRm0D783Vbj4ZOBsll1hEc+wtvnbQLQLxmemMzIKTgwdB04t89/1O/w1cDnyilFU=';

async function doPost(req, res) {
  const latestEvent = req.body.events[0];
  const replyToken = latestEvent.replyToken;
  const userMessage = latestEvent.message.text;
  const url = 'https://api.line.me/v2/bot/message/reply';

  // メッセージに「観光」が含まれているかどうかを確認
  if (userMessage.includes('観光')) {
    await axios.post(url, {
      replyToken: replyToken,
      messages: [{
        type: 'text',
        text: '観光に行くのですね！楽しんできてください！',
      }],
    }, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + ACCESS_TOKEN,
      },
    });

    // IF文の暴力を開始
    sendReply(replyToken, '観光地案内へようこそ！ビーチに行きたいですか？ (はい/いいえ)');
  } else {
    // 既存の会話が続行中の場合、ユーザーの回答に応じて進行状態を管理します
    if (userMessage === 'はい') {
      // ビーチに行く場合のアクション
      sendReply(replyToken, 'ビーチに行く気分ですね！実際の観光地情報を提供します。');
    } else if (userMessage === 'いいえ') {
      // 他の観光地を提案するアクション
      sendReply(replyToken, '他の観光地も魅力的ですね！どんな場所が気になりますか？');
    } else {
      // 無効な回答に対するメッセージ
      sendReply(replyToken, 'はいかいいえでお答えください。');
    }
  }

  res.json({ content: 'post ok' });
}

// LINE APIへの応答を送信するヘルパー関数
async function sendReply(replyToken, message) {
  const url = 'https://api.line.me/v2/bot/message/reply';
  await axios.post(url, {
    replyToken: replyToken,
    messages: [{
      type: 'text',
      text: message,
    }],
  }, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
  });
}

// Express.js サーバーのセットアップ
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  await doPost(req, res);
});

app.listen(port, () => {
  console.log(`サーバーはポート${port}で実行されています`);
});
