var CHANNEL_ACCESS_TOKEN = 'アクセストークン'; 

function doPost(e) {
  // メッセージ受信
  var json = JSON.parse(e.postData.contents);
  var user_message = json.events[0].message.text;
  
  // 処理分岐
  var message; // 送信メッセージ定義
  var user_message_array = user_message; //受信メッセージの配列
  Array.from(user_message_array); //配列化
  
  if (user_message.indexOf('re') === 0) {
    message = resistance(user_message_array); //抵抗関数へ
  } else if (user_message.indexOf('ca') === 0) {
    message = capacitor(user_message_array); //コンデンサ関数へ
  } else if (user_message === 'color') {
    message = "0:黒\n1:茶\n2:赤\n3:橙\n4:黄\n5:緑\n6:青\n7:紫\n8:灰\n9:白";
  } else if (user_message.indexOf('co') === 0) {
    message = coil(user_message_array); //コイル関数へ
  } else if (user_message === 'info') {
    message = "【抵抗】re○○○▲\n○：数値，▲：g(金)s(銀)\n\n【コンデンサ】ca○○○\n○：数値\n\n【コイル】co○○○\n○：数値\n\n【カラーコード】color";
  } else {
    message = "Error_01";
  }
  
  // メッセージ送信
  var messages = [{
        "type": "text",
        "text": message
  }];
  
  UrlFetchApp.fetch('https://api.line.me/v2/bot/message/reply', {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': json.events[0].replyToken,
      'messages': messages,
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}


//抵抗関数
function resistance(user_message_array) {
  var calculation;
  var message;
  var error_value;
  
  calculation = (10 * Number(user_message_array[2]) + Number(user_message_array[3])) * (10 ** Number(user_message_array[4]));
  
  //許容誤差
  if (user_message_array[5] == "g") {
    error_value = "±5%";
  } else if (user_message_array[5] == "s") {
    error_value = "±10%";
  } else {
    error_value = "";
  }
  
  //値処理
  if (calculation >= 10**9) {
    message = Math.round((calculation * (10 ** -9)) * 100) / 100 + "GΩ" + error_value;
  } else if (calculation >= 10**6) {
    message = Math.round((calculation * (10 ** -6)) * 100) / 100 + "MΩ" + error_value;
  } else if (calculation >= 10**3) {
    message = Math.round((calculation * (10 ** -3)) * 100) / 100 + "kΩ" + error_value;
  } else {
    message = Math.round(calculation * 100) / 100  + "Ω" + error_value;
  }
  
  return message;
}


//コンデンサ関数
function capacitor(user_message_array) {
  var calculation;
  var message;
  
  calculation = (10 * Number(user_message_array[2]) + Number(user_message_array[3])) * (10 ** Number(user_message_array[4]));
  
  //値処理
  if (calculation >= 10**12) {
    message = calculation * (10 ** -12) + "F";
  } else if (calculation >= 10**9) {
    message = calculation * (10 ** -9) + "mF";
  } else if (calculation >= 10**6) {
    message = calculation * (10 ** -6)+ "μF";
  } else if (calculation >= 10**3) {
    message = calculation * (10 ** -3)+ "nF";
  } else {
    message = calculation + "pF";
  }
  
  return message;
}


//コイル関数
function coil(user_message_array) {
  var calculation;
  var message;
  
  calculation = (10 * Number(user_message_array[2]) + Number(user_message_array[3])) * (10 ** Number(user_message_array[4]));
  
  //値処理
  if (calculation >= 10**9) {
    message = calculation * (10 ** -9) + "kH";
  } else if (calculation >= 10**6) {
    message = calculation * (10 ** -6) + "H";
  } else if (calculation >= 10**3) {
    message = calculation * (10 ** -3) + "mH";
  } else if (calculation >= 0) {
    message = calculation + "μH";
  } else {
    message = calculation * (10 ** 3) + "nH";
  }
  
  return message;
}
