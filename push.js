// lambda関数
// - Node.js 16.x
// - arm64
// - 環境変数: ACCESS_TOKEN
const line = require("@line/bot-sdk");
const client = new line.Client({ channelAccessToken: process.env.ACCESS_TOKEN });

exports.handler = async (event, context) => {
  const params = JSON.parse(event.queryStringParameters["0"]);
  const text = params.text;
  
  const userId = "xxxxxxxxxxx";  // 友達登録時などにidをdbに保存して取得するなど

  // LINE Messageオブジェクト(https://developers.line.biz/ja/reference/messaging-api/#message-objects)
  const message = {
    type: "text",
    text: text
  };
  
  try {
    await client.pushMessage(userId, message);
    const response = {
      statusCode: 200,
      headers: { "X-Line-Status" : "OK"},
      body: JSON.stringify({
        message: "success"
      })
    }
    return response;
  } catch(error) {
    console.log(error);
  }
};
