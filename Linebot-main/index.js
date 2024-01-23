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


 
