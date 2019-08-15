// const messageHandler = require('./messageHandler.js');
const WebSocket = require('ws');

function getCookie(cname, cookie){
	var name = cname + "=";
	var ca = cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
	}
	return "";
}

const middleWare = function(wss) {
	let cookieMap = [];
	wss.on('connection', function (ws,req) { //捕获连接请求
		let username = getCookie('username', req.headers.cookie);
		if(cookieMap.indexOf(username) === -1) {
			cookieMap.push(username);
			ws.send(JSON.stringify({
				msg: `当前用户列表`,
				system: true,
				type: 'all',
				detail: cookieMap
			}));
			wss.clients.forEach((client) => {
	        	if(client !== ws && client.readyState === WebSocket.OPEN) {
	        		client.send(JSON.stringify({
						msg: `新用户${username}加入`,
						system: true,
						type: 'join',
						detail: username
					}));
	        	}
		    });
		}
		console.log(cookieMap);
	    console.log(`服务端监听到${username}的连接请求`);

	    // ws.on('message', messageHandler);
	   	ws.on('message', function (message) {
	   		let messageObj = JSON.parse(message);
	   		if(messageObj.type === 'close') {
	   			let index = cookieMap.indexOf(messageObj.cookie);
	   			cookieMap.splice(index, 1);
	   			console.log(cookieMap);
	   			wss.clients.forEach((client) => {
			    	if(client !== ws && client.readyState === WebSocket.OPEN) {
			    		client.send(JSON.stringify({
							msg: `用户${username}退出`,
							system: true,
							type: 'left',
							detail: username
						}));
			    	}
			    });
	   		} else {
			    console.log(`收到${messageObj.cookie}的消息: ${messageObj.msg}`);
			    wss.clients.forEach((client) => {
			    	if(client !== ws && client.readyState === WebSocket.OPEN) {
			    		client.send(message); //逐个客户端发送消息,除去发送方
			    	}
			    });
	   		}
		}); 
	    ws.addEventListener('close', function() {
		  	console.log('有用户断开连接');
		});
	});
}

module.exports = middleWare;
