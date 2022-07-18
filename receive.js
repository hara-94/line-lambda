// lambda関数
// - Node.js 16.x
// - arm64
// - 環境変数: ACCESS_TOKEN, CHANNEL_SECRET
const line = require("@line/bot-sdk");
const client = new line.Client({ channelAccessToken: process.env.ACCESS_TOKEN });
const crypto = require("crypto");

exports.handler = function (event, context) {
  const body = JSON.parse(event.body);
  const signature = crypto
    .createHmac("sha256", process.env.CHANNEL_SECRET)
    .update(event.body)
    .digest("base64");

  //署名の検証(https://developers.line.biz/ja/reference/messaging-api/#signature-validation)
  let checkHeader;
  const headers = event.headers || {};
  //大文字・小文字は予告なく変更あるらしい(https://developers.line.biz/ja/reference/messaging-api/#request-headers)
  if (headers["x-line-signature"]) {
    checkHeader = headers["x-line-signature"];
  } else if (headers["X-Line-Signature"]) {
    checkHeader = headers["X-Line-Signature"];
  }
  if (signature !== checkHeader) {
    const response = {
      statusCode: 403,
      body: JSON.stringify({
        message: "Unauthorized"
      })
    };
    return response;
  }
  if (body.events.length === 0) {  // Webhookの検証, 再送の接続確認(https://developers.line.biz/ja/reference/messaging-api/#response)
    let response = {
      statusCode: 200,
      headers: { "X-Line-Status": "OK" },
      body: '{"result":"connect check"}',
    };
    return response;
  } else {
    const replyToken = body.events[0].replyToken;
    const message = {
      type: "text",
      text: "Hello, LINE"
    };
    client.replyMessage(replyToken, message).then(() => {
      const response = {
        statusCode: 200,
        headers: { "X-Line-Status" : "OK"},
        body: '{"result":"completed"}'
      };
      return response;
    }).catch(error => {
      console.log("replyMessage error: " + error);
    });
  }
};
