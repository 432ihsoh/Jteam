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
        .then((result) => res.json(result))
        .catch((error) => {
            console.error('Error handling events:', error);
            res.status(500).end();
        });
});
// ユーザーごとの回答状態を保持するオブジェクト
let userState = {};
const client = new line.Client(config);
// ...（前略）

async function handleEvent(event) {
    // 以前の回答状態を取得するか、初期化する
    const currentState = userState[event.source.userId] || { step: 0 };

    if (event.type !== 'message' || event.message.type !== 'text') {
        // テキスト以外のメッセージが来た場合のエラーハンドリング
        const errorMessage = 'すみません、テキストメッセージでお答えいただけますか？';
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: errorMessage
        });
    }

    const userMessage = event.message.text.toLowerCase();

    // 最初に戻るを処理
    if (userMessage === '最初に戻る') {
        // 質問プロセスを最初から始める
        resetUserState(event.source.userId);
        return Promise.resolve(null);
    }

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
                const responseText = '子供はいる？（はい／いいえ）';
                // ステップを進める
                currentState.step = Left;
                // ユーザーに回答を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: responseText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '子供はいる？（はい／いいえ）';
                // ステップを進める
                currentState.step = 4; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;
        case 2:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '体を動かして遊びたいですか？（はい／いいえ）';
                // ステップを進める
                currentState.step = 3; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '体を動かして遊びたいですか？（はい／いいえ）';
                // ステップを進める
                currentState.step = 5; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;

        case 3:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = 'ポケモンマスターになりたいですか？（はい／いいえ）';
                // ステップを進める
                currentState.step = 15; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '動物が好き？（はい／いいえ）';
                // ステップを進める
                currentState.step = 8; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;

        case 4: // 新しい質問のステップ
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '体を動かして遊びたいですか？（はい／いいえ）';
                // ステップを進める
                currentState.step = 6; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '見て回るのが好きですか？（はい／いいえ）';
                // ステップを進める
                currentState.step = 7; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;
        case 5:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '涼しいところがいい？（はい／いいえ）';
                // ステップを進める
                currentState.step = 21; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '動物が好き？（はい／いいえ）';
                // ステップを進める
                currentState.step = 8; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;


        case 6: // 新しい質問のステップ
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = 'カルチャーパーク？（はい／いいえ）';
                // ステップを進める
                currentState.step = 25; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '宇宙に興味ある？（はい／いいえ）';
                // ステップを進める
                currentState.step = 9; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;



        case 7: // 新しい質問のステップ
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '芸術に興味がある？（はい/いいえ）';
                // ステップを進める
                currentState.step = 10; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '温泉は好きですか？（はい／いいえ）';
                // ステップを進める
                currentState.step = 11; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;

        case 8:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = 'ふれあい牧場？（はい／いいえ）';
                // ステップを進める
                currentState.step = 28; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = 'きれいな花は好き？（はい／いいえ）';
                // ステップを進める
                currentState.step = 16; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;

        case 9: // 新しい質問のステップ
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = 'スペースパークはどうですか？（はい／いいえ）';
                // ステップを進める
                currentState.step = 25; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = 'リカちゃんキャッスルはどうですか？（はい／いいえ）';
                // ステップを進める
                currentState.step = 9; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;


        case 10: // 新しい質問のステップ
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '郡山美術館？（はい／いいえ）';
                // ステップを進める
                currentState.step = 12; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = 'スペースパークに興味がありますか？（はい／いいえ）';
                // ステップを進める
                currentState.step = 13; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;

        case 11: // 新しい質問のステップ
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = 'プールで泳ぎたい？（はい／いいえ）';
                // ステップを進める
                currentState.step = 12; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '田村神社？（はい／いいえ）';
                // ステップを進める
                currentState.step = 31; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;

        case 12: // 新しい質問のステップ
            if (userMessage === 'はい') {
                // 'はい' に対する処理（郡山美術館に興味あり）
                const responseText = '湯ラックス温泉？';
                // ステップを進める
                currentState.step = 29; // 最初のステップに戻す
                // ユーザーに回答を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: responseText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理（郡山美術館に興味なし）
                const followUpQuestionText = '磐梯熱海温泉？';
                // ステップを進める
                currentState.step = 26; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;

        case 13:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = 'みはるたきざくらorぬのひきこうげんorぼたんえん';
                // ステップを進める
                currentState.step = 4; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '浄土松公園';
                // ステップを進める
                currentState.step = 25; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;
        case 15:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '開成山公園？（はい／いいえ）';
                // ステップを進める
                currentState.step = 24; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = 'カルチャーパーク？（はい／いいえ）';
                // ステップを進める
                currentState.step = 25; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;
        case 16:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '桜とかどう？（はい／いいえ）';
                // ステップを進める
                currentState.step = 17; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '田村神社？（はい／いいえ）';
                // ステップを進める
                currentState.step = 100; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;
        case 17:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '三春滝桜？（はい／いいえ）';
                // ステップを進める
                currentState.step = 19; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '牡丹は？？（はい／いいえ）';
                // ステップを進める
                currentState.step = 20; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;
        case 20:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '須賀川牡丹園？（はい／いいえ）';
                // ステップを進める
                currentState.step = 19; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '布引高原ひまわり畑？（はい／いいえ）';
                // ステップを進める
                currentState.step = 20; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;
        case 21:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '阿武隈？（はい／いいえ）';
                // ステップを進める
                currentState.step = 31; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '果物狩りたい？（はい／いいえ）';
                // ステップを進める
                currentState.step = 22; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;
        case 22:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '果物狩り';
                // ステップを進める
                currentState.step = 31; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '大堀相馬焼or　      浄土松公園？（はい／いいえ）';
                // ステップを進める
                currentState.step = 22; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;

        case 23:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '果物狩り';
                // ステップを進める
                currentState.step = 31; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '大堀相馬焼or　      浄土松公園？（はい／いいえ）';
                // ステップを進める
                currentState.step = 22; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;
        case 21:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '阿武隈？（はい／いいえ）';
                // ステップを進める
                currentState.step = 31; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '果物狩りたい？（はい／いいえ）';
                // ステップを進める
                currentState.step = 22; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;
        case 22:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '果物狩り';
                // ステップを進める
                currentState.step = 31; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '大堀相馬焼or　      浄土松公園？（はい／いいえ）';
                // ステップを進める
                currentState.step = 22; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;

        case 25:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = 'カルチャーパークが見つかりました。\nこちらは遊園地をはじめ、屋内遊び場や体育館などがある複合施設です。\n観光地の詳細または観光地の位置情報は下のURLをご確認ください。';

                // 表示したいURL
                const parkURL = 'https://www.koriyamaculturepark.com/';  // 実際のURLに置き換えてください

                // 観光地の位置情報
                const mapLocationText = 'Location of the cultural park:\nhttps://maps.google.com/?q=37.36588765864892,140.3295308803135';
                // 実際の緯度と経度に置き換えてください

                currentState.step = 31; // 新しい質問のステップ
                // ユーザーにフォローアップの質問、URL、位置情報を送信
                return client.replyMessage(event.replyToken, [
                    {
                        type: 'text',
                        text: followUpQuestionText
                    },
                    {
                        type: 'text',
                        text: parkURL
                    },
                    {
                        type: 'text',
                        text: mapLocationText
                    }
                ]);
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '大堀相馬焼or 浄土松公園？（はい／いいえ）';
                // ステップを進める
                currentState.step = 22; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;
        case 25:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = 'カルチャーパークが見つかりました。\nこちらは遊園地をはじめ、屋内遊び場や体育館などがある複合施設です。\n観光地の詳細または観光地の位置情報は下のURLをご確認ください。';

                // 表示したいURL
                const parkURL = 'https://www.koriyamaculturepark.com/';  // 実際のURLに置き換えてください

                // 観光地の位置情報
                const mapLocationText = 'Location of the cultural park:\nhttps://maps.google.com/?q=37.36588765864892,140.3295308803135';
                // 実際の緯度と経度に置き換えてください

                currentState.step = 31; // 新しい質問のステップ
                // ユーザーにフォローアップの質問、URL、位置情報を送信
                return client.replyMessage(event.replyToken, [
                    {
                        type: 'text',
                        text: followUpQuestionText
                    },
                    {
                        type: 'text',
                        text: parkURL
                    },
                    {
                        type: 'text',
                        text: mapLocationText
                    }
                ]);
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '大堀相馬焼or 浄土松公園？（はい／いいえ）';
                // ステップを進める
                currentState.step = 22; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;
        case 26:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '磐梯熱海温泉が見つかりました/nこちらは800年の歴史がある温泉旅館です。湯量が豊富でお肌に良い弱アルカリ泉が楽しめます。\n観光地の詳細または観光地の位置情報は下のURLをご確認ください。';

                // 表示したいURL
                const parkURL = 'https://www.bandaiatami.or.jp/';  // 実際のURLに置き換えてください

                // 観光地の位置情報
                const mapLocationText = 'Location of the cultural park:\nhttps://maps.google.com/?q= 37.48113922956151, 140.27205601929367';
                // 実際の緯度と経度に置き換えてください

                currentState.step = 31; // 新しい質問のステップ
                // ユーザーにフォローアップの質問、URL、位置情報を送信
                return client.replyMessage(event.replyToken, [
                    {
                        type: 'text',
                        text: followUpQuestionText
                    },
                    {
                        type: 'text',
                        text: parkURL
                    },
                    {
                        type: 'text',
                        text: mapLocationText
                    }
                ]);
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '大堀相馬焼or 浄土松公園？（はい／いいえ）';
                // ステップを進める
                currentState.step = 22; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;
        case 27:
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = '石筵ふれあい牧場が見つかりました/n こちらは動物と触れ合うことができる憩いの場です。\n観光地の詳細または観光地の位置情報は下のURLをご確認ください。';

                // 表示したいURL
                const parkURL = 'https://www.fureai-bokujo.jp/';  // 実際のURLに置き換えてください

                // 観光地の位置情報
                const mapLocationText = 'Location of the cultural park:\nhttps://maps.google.com/?q= 37.56045303410075, 140.25831356516093';
                // 実際の緯度と経度に置き換えてください

                currentState.step = 31; // 新しい質問のステップ
                // ユーザーにフォローアップの質問、URL、位置情報を送信
                return client.replyMessage(event.replyToken, [
                    {
                        type: 'text',
                        text: followUpQuestionText
                    },
                    {
                        type: 'text',
                        text: parkURL
                    },
                    {
                        type: 'text',
                        text: mapLocationText
                    }
                ]);
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理
                const followUpQuestionText = '大堀相馬焼or 浄土松公園？（はい／いいえ）';
                // ステップを進める
                currentState.step = 22; // 新しい質問のステップ
                // ユーザーにフォローアップの質問を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: followUpQuestionText
                });
            } else {
                // はい／いいえ以外の回答へのエラーハンドリング
                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: errorMessage
                });
            }
            break;
            case 28:
                if (userMessage === 'はい') {
                    // 'はい' に対する処理
                    const followUpQuestionText = '石筵ふれあい牧場が見つかりました/n こちらは動物と触れ合うことができる憩いの場です。\n観光地の詳細または観光地の位置情報は下のURLをご確認ください。';
    
                    // 表示したいURL
                    const parkURL = 'https://www.fureai-bokujo.jp/';  // 実際のURLに置き換えてください
    
                    // 観光地の位置情報
                    const mapLocationText = 'Location of the cultural park:\nhttps://maps.google.com/?q= 37.56045303410075, 140.25831356516093';
                    // 実際の緯度と経度に置き換えてください
    
                    currentState.step = 31; // 新しい質問のステップ
                    // ユーザーにフォローアップの質問、URL、位置情報を送信
                    return client.replyMessage(event.replyToken, [
                        {
                            type: 'text',
                            text: followUpQuestionText
                        },
                        {
                            type: 'text',
                            text: parkURL
                        },
                        {
                            type: 'text',
                            text: mapLocationText
                        }
                    ]);
                } else if (userMessage === 'いいえ') {
                    // 'いいえ' に対する処理
                    const followUpQuestionText = '大堀相馬焼or 浄土松公園？（はい／いいえ）';
                    // ステップを進める
                    currentState.step = 22; // 新しい質問のステップ
                    // ユーザーにフォローアップの質問を送信
                    return client.replyMessage(event.replyToken, {
                        type: 'text',
                        text: followUpQuestionText
                    });
                } else {             
                    const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                    return client.replyMessage(event.replyToken, {
                        type: 'text',
                        text: errorMessage
                    });
                }
                break;
                case 29:
                    if (userMessage === 'はい') {
                        // 'はい' に対する処理
                        const followUpQuestionText = 'ユラックス(熱海)が見つかりました/nこちらはコンベンションとスポーツ施設に温泉機能を組み合わせた多目的な施設です。隣接するアイスアリーナではスケートも楽しめます。\n観光地の詳細または観光地の位置情報は下のURLをご確認ください。';
        
                        // 表示したいURL
                        const parkURL = 'https://www.yracs.jp/';  // 実際のURLに置き換えてください
        
                        // 観光地の位置情報
                        const mapLocationText = 'Location of the cultural park:\nhttps://maps.google.com/?q=  37.48090300678727, 140.27820545741048';
                        // 実際の緯度と経度に置き換えてください
        
                        currentState.step = 31; // 新しい質問のステップ
                        // ユーザーにフォローアップの質問、URL、位置情報を送信
                        return client.replyMessage(event.replyToken, [
                            {
                                type: 'text',
                                text: followUpQuestionText
                            },
                            {
                                type: 'text',
                                text: parkURL
                            },
                            {
                                type: 'text',
                                text: mapLocationText
                            }
                        ]);
                    } else if (userMessage === 'いいえ') {
                        // 'いいえ' に対する処理
                        const followUpQuestionText = '大堀相馬焼or 浄土松公園？（はい／いいえ）';
                        // ステップを進める
                        currentState.step = 22; // 新しい質問のステップ
                        // ユーザーにフォローアップの質問を送信
                        return client.replyMessage(event.replyToken, {
                            type: 'text',
                            text: followUpQuestionText
                        });
                    } else {
                        // はい／いいえ以外の回答へのエラーハンドリング
                        const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                        return client.replyMessage(event.replyToken, {
                            type: 'text',
                            text: errorMessage
                        });
                    }
                    break;
                    case 30:
                        if (userMessage === 'はい') {
                            // 'はい' に対する処理
                            const followUpQuestionText = 'ユラックス(熱海)が見つかりました/nこちらはコンベンションとスポーツ施設に温泉機能を組み合わせた多目的な施設です。隣接するアイスアリーナではスケートも楽しめます。\n観光地の詳細または観光地の位置情報は下のURLをご確認ください。';
            
                            // 表示したいURL
                            const parkURL = 'https://www.yracs.jp/';  // 実際のURLに置き換えてください
            
                            // 観光地の位置情報
                            const mapLocationText = 'Location of the cultural park:\nhttps://maps.google.com/?q=  37.48090300678727, 140.27820545741048';
                            // 実際の緯度と経度に置き換えてください
            
                            currentState.step = 31; // 新しい質問のステップ
                            // ユーザーにフォローアップの質問、URL、位置情報を送信
                            return client.replyMessage(event.replyToken, [
                                {
                                    type: 'text',
                                    text: followUpQuestionText
                                },
                                {
                                    type: 'text',
                                    text: parkURL
                                },
                                {
                                    type: 'text',
                                    text: mapLocationText
                                }
                            ]);
                        } else if (userMessage === 'いいえ') {
                            // 'いいえ' に対する処理
                            const followUpQuestionText = '大堀相馬焼or 浄土松公園？（はい／いいえ）';
                            // ステップを進める
                            currentState.step = 22; // 新しい質問のステップ
                            // ユーザーにフォローアップの質問を送信
                            return client.replyMessage(event.replyToken, {
                                type: 'text',
                                text: followUpQuestionText
                            });
                        } else {
                            // はい／いいえ以外の回答へのエラーハンドリング
                            const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                            return client.replyMessage(event.replyToken, {
                                type: 'text',
                                text: errorMessage
                            });
                        }
                        break;
                        case 31:
                            if (userMessage === 'はい') {
                                // 'はい' に対する処理
                                const followUpQuestionText = ' 田村神社が見つかりました\nこちらは郡山市の歴史ある神社が楽しめます。。隣接するアイスアリーナではスケートも楽しめます。\n観光地の詳細または観光地の位置情報は下のURLをご確認ください。';
                
                                // 表示したいURL
                                const parkURL = 'https://akutsu-tamurajinjya.jimdofree.com/';  // 実際のURLに置き換えてください
                
                                // 観光地の位置情報
                                const mapLocationText = 'Location of the cultural park:\nhttps://maps.google.com/?q=  37.33852712566796, 140.4064579244891';
                                // 実際の緯度と経度に置き換えてください
                
                                currentState.step = 31; // 新しい質問のステップ
                                // ユーザーにフォローアップの質問、URL、位置情報を送信
                                return client.replyMessage(event.replyToken, [
                                    {
                                        type: 'text',
                                        text: followUpQuestionText
                                    },
                                    {
                                        type: 'text',
                                        text: parkURL
                                    },
                                    {
                                        type: 'text',
                                        text: mapLocationText
                                    }
                                ]);
                            } else if (userMessage === 'いいえ') {
                                // 'いいえ' に対する処理
                                const followUpQuestionText = '大堀相馬焼or 浄土松公園？（はい／いいえ）';
                                // ステップを進める
                                currentState.step = 22; // 新しい質問のステップ
                                // ユーザーにフォローアップの質問を送信
                                return client.replyMessage(event.replyToken, {
                                    type: 'text',
                                    text: followUpQuestionText
                                });
                            } else {
                                // はい／いいえ以外の回答へのエラーハンドリング
                                const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                                return client.replyMessage(event.replyToken, {
                                    type: 'text',
                                    text: errorMessage
                                });
                            }
                            break;
                            case 32:
                                if (userMessage === 'はい') {
                                    // 'はい' に対する処理
                                    const followUpQuestionText = ' 三春滝桜が見つかりましたこちらは国の天然記念物に指定されている、日本三大桜の一つです。\n観光地の詳細または観光地の位置情報は下のURLをご確認ください。';
                    
                                    // 表示したいURL
                                    const parkURL = 'https://miharukoma.com/experience/183/';  // 実際のURLに置き換えてください
                    
                                    // 観光地の位置情報
                                    const mapLocationText = 'Location of the cultural park:\nhttps://maps.google.com/?q=  37.40788850628246, 140.50014756867017';
                                    // 実際の緯度と経度に置き換えてください
                    
                                    currentState.step = 31; // 新しい質問のステップ
                                    // ユーザーにフォローアップの質問、URL、位置情報を送信
                                    return client.replyMessage(event.replyToken, [
                                        {
                                            type: 'text',
                                            text: followUpQuestionText
                                        },
                                        {
                                            type: 'text',
                                            text: parkURL
                                        },
                                        {
                                            type: 'text',
                                            text: mapLocationText
                                        }
                                    ]);
                                } else if (userMessage === 'いいえ') {
                                    // 'いいえ' に対する処理
                                    const followUpQuestionText = '大堀相馬焼or 浄土松公園？（はい／いいえ）';
                                    // ステップを進める
                                    currentState.step = 22; // 新しい質問のステップ
                                    // ユーザーにフォローアップの質問を送信
                                    return client.replyMessage(event.replyToken, {
                                        type: 'text',
                                        text: followUpQuestionText
                                    });
                                } else {
                                    // はい／いいえ以外の回答へのエラーハンドリング
                                    const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
                                    return client.replyMessage(event.replyToken, {
                                        type: 'text',
                                        text: errorMessage
                                    });
                                }
                                break;
                            
                    









        case 14: // 新しい質問のステップ
            if (userMessage === 'はい') {
                // 'はい' に対する処理（スペースパークに興味あり）
                const responseText = 'スペースパークは楽しい場所ですね！';
                // ステップを進める
                currentState.step = 0; // 最初のステップに戻す
                // ユーザーに回答を送信
                return client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: responseText
                });
            } else if (userMessage === 'いいえ') {
                // 'いいえ' に対する処理（スペースパークに興味なし）
                const followUpQuestionText = '他に興味がある場所はありますか？';
                // ステップを進める
                currentState.step = 14; // 新しい質問のステップ
                // ユーザーにフォローアッ

            }

            // ユーザーの回答状態を更新
            userState[event.source.userId] = currentState;

            return Promise.resolve(null);
    }

    function resetUserState(userId) {
        // ユーザーの回答状態を初期化
        userState[userId] = { step: 0 };
    }


}

app.listen(PORT);
console.log(`Server running at ${PORT}`);

















































































