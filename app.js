// server
const express = require('express');
const app = express();
const wsMiddleware = require('./wsMiddleware');

app.use(express.static('public')) //托管静态文件
let server = app.listen(3000) //监听3000端口

// 导入WebSocket模块:
const WebSocket = require('ws');

// 引用Server类:
const WebSocketServer = WebSocket.Server;

function ClientVerify(info) { //连接的时候进行身份验证
	return true;
}
// 实例化:
const wss = new WebSocketServer({
    server: server,
    verifyClient: ClientVerify,
});

wsMiddleware(wss);
