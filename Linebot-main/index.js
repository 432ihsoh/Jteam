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
                currentState.step = 2;
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
                    currentState.step = 4; // 新しい質問のステップ
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
                    currentState.step = 4; // 新しい質問のステップ
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
                currentState.step = 8; // 新しい質問のステップ
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
                    currentState.step = 4; // 新しい質問のステップ
                    // ユーザーにフォローアップの質問を送信
                    return client.replyMessage(event.replyToken, {
                        type: 'text',
                        text: followUpQuestionText
                    });
                } else if (userMessage === 'いいえ') {
                    // 'いいえ' に対する処理
                    const followUpQuestionText = 'おはなみたい？（はい／いいえ）';
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

            case 9: // 新しい質問のステップ
            if (userMessage === 'はい') {
                // 'はい' に対する処理
                const followUpQuestionText = 'スペースパークはどうですか？（はい／いいえ）';
                // ステップを進める
                currentState.step = 8; // 新しい質問のステップ
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

case 12: // 新しい質問のステップ
if (userMessage === 'はい') {
    // 'はい' に対する処理（郡山美術館に興味あり）
    const responseText = '湯ラックス温泉？';
    // ステップを進める
    currentState.step = 0; // 最初のステップに戻す
    // ユーザーに回答を送信
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: responseText
    });
} else if (userMessage === 'いいえ') {
    // 'いいえ' に対する処理（郡山美術館に興味なし）
    const followUpQuestionText = '磐梯熱海温泉？';
    // ステップを進める
    currentState.step = 14; // 新しい質問のステップ
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

case 13: // 新しい質問のステップ
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

    } else { // はい／いいえ以外の回答へのエラーハンドリング
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
    const responseText = 'みはるたきざくらorぬのひきこうげんorぼたんえん！';
    // ステップを進める
    currentState.step = 0; // 最初のステップに戻す
    // ユーザーに回答を送信
    return client.replyMessage(event.replyToken, {
        type: 'text',
        text: responseText
    });
} else if (userMessage === 'いいえ') {
    // 'いいえ' に対する処理（スペースパークに興味なし）
    const followUpQuestionText = '浄土松公園？';
    // ステップを進める
    currentState.step = 14; // 新しい質問のステップ
    // ユーザーにフォローアッ

    } else { // はい／いいえ以外の回答へのエラーハンドリング
        const errorMessage = '申し訳ありませんが、はいかいいえでお答えください。';
        return client.replyMessage(event.replyToken, {
            type: 'text',
            text: errorMessage
        });
    }
    break;
    

    

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

















































































