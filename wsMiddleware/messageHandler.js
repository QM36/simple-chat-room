// const WebSocket = require('ws');

// module.exports = function (message) {
// 	let messageObj = JSON.parse(message);
//     console.log(`收到${messageObj.cookie}的消息: ${messageObj.msg}`);
//     wss.clients.forEach((client) => {
//     	if(client !== ws && client.readyState === WebSocket.OPEN) {
//     		client.send(message); //逐个客户端发送消息,除去发送方
//     	}
//     });
// };
