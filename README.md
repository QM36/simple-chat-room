## 基于WebSocket实现的简易聊天室

### 技术栈
* 协议层：WebSocket
* 服务器：Node.js并引用第三方库[ws](https://github.com/websockets/ws)
* 客户端：原生js

### 运行方式
```
git clone https://github.com/QM36/simple-chat-room.git
cd simple-chat-room
node app.js
```

### 功能
* 即时聊天，仅支持文字、emoji
* 支持cookie身份验证，无需登录注册，第一次进入页面设置用户名即可，cookie过期即用户名失效，也可以手动在浏览器删除cookie
* 右侧展示所有已经连接的所有用户的用户名
* 有用户退出和加入的系统提醒
* 有头像展示，头像是用户名的首字母大写生成的
	![](http://ww1.sinaimg.cn/large/006XqmrNly1g60gajj4xmj31di15gdip.jpg)

### 难点
* 用户身份的判定：利用cookie,但是由于WebSocket是一种长连接的协议，本身不需要cookie记录连接状态，所以在其报文中并不会自动带cookie，需要手动带，可以选择带在报文头，此处的方案是携带在发送的message信息中。message只能是string类型，所以首先将message构造成对象，在传输是转为字符串，解析时再转为对象
	```js
	function setCookie(cname,cvalue,exdays){ //根据用户名设置cookie
		var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));//用时间戳返回时间
		var expires = "expires="+d.toGMTString();//设置到期时间
		document.cookie = cname+"="+cvalue+"; "+expires;//创建cookie
	}
	function sendMessage() { //在发送消息时带上cookie作为身份id
		let value = document.getElementById('input').value;
		if(value) {
			let message = {};
			message.msg = value;
			message.cookie = getCookie('username',document.cookie);
			ws.send(JSON.stringify(message));
			console.log(`发送:${value}`);
			createMessageDiv(message, true);
			autoScroll();
		}
		document.getElementById('input').value = '';
	}
	```
* 如何监听用户的离开和进入：用户手动关闭页面或者刷新都会造成断开连接，断开连接即为离开聊天室，在客户端需要处理的是，在`window.onbeforeunload`触发时，向服务器发送一条message，告知该用户的信息，服务器再将这条信息转发给所有已经连接的用户。服务器发送的信息与客户端发送的信息用专门字段区分
	```js
	wss.clients.forEach((client) => { //服务器向各个客户端发送退出的消息
    	if(client !== ws && client.readyState === WebSocket.OPEN) {
    		client.send(JSON.stringify({
				msg: `用户${username}退出`,
				system: true,
				type: 'left',
				detail: username
			}));
    	}
    });
    window.onbeforeunload = function() { //客户端监听页面关闭和刷新的事件向服务器发送消息
		ws.send(JSON.stringify({cookie: getCookie('username',document.cookie),type: 'close'}));
	}
	```