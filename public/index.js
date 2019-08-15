(function() {
	// let user = 'qumeng';
	// let ws = new WebSocket(`ws://localhost:3000?name=${user}`); //发起监听请求
	checkCookie()
	let ws = new WebSocket(`ws://${location.host}`); //发起监听请求
	// let ws = new WebSocket(`ws://localhost:3000`); //发起监听请求
	
	ws.onmessage = function (event) { //监听消息
		let message = JSON.parse(event.data)
	    console.log(`收到：${message.msg}`);
	    if(message.type === 'all') {
	    	console.log(message.detail);
	    	initUserList(message.detail);
	    } else {
	    	createMessageDiv(message, false);
		    updateUserList(message);
		    autoScroll();
	    }
	};

	document.getElementById('send').addEventListener('click', () => {
		sendMessage();
	})
	document.getElementById('input').addEventListener('keyup', (event) => {
		if(event.keyCode === 13) {
			sendMessage();
		}
	})
	window.onbeforeunload = function() {
		ws.send(JSON.stringify({cookie: getCookie('username',document.cookie),type: 'close'}));
	}
	
	// ws.onclose = function() {}
	// window.onunload = function() {
	// 	ws.send(JSON.stringify({cookie: getCookie('username',document.cookie),type: 'close'}));
	// 	// ws.close();
	// }

	function sendMessage() {
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
	function createMessageDiv(message, self) {
		let div = document.createElement('div');
		if(message.system) {
			let messageDiv = document.createElement('div');
			messageDiv.innerHTML = message.msg;
			div.appendChild(messageDiv);
			div.className = 'sysMessage';
			messageDiv.className = 'sysMessageDiv';
		} else {
			let messageDiv = document.createElement('div');
			let portrait = document.createElement('div');
			if(!self) {
				messageDiv.className = 'messageDiv';
				div.className = 'message';
			} else {
				messageDiv.className = 'selfMessageDiv';
				div.className = 'selfMessage';
			}
			portrait.innerHTML = message.cookie.split('')[0].toUpperCase();
			portrait.className = 'portrait';
		    messageDiv.innerHTML = message.msg;
		    
			div.appendChild(portrait);
			div.appendChild(messageDiv);
		}
		document.getElementById('content').appendChild(div);
	}
	function autoScroll() {
		let scrollDom = document.getElementById('content');
		scrollDom.scrollTop = scrollDom.scrollHeight;
	}
	function setCookie(cname,cvalue,exdays){
		var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));//用时间戳返回时间
		var expires = "expires="+d.toGMTString();//设置到期时间
		document.cookie = cname+"="+cvalue+"; "+expires;//创建cookie
	}
	function getCookie(cname, cookie){
		var name = cname + "=";
		var ca = cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i].trim(); //去掉字符串中的空格
			if (c.indexOf(name) === 0) { 
				return c.substring(name.length,c.length); 
			}
		}
		return "";
	}
	function checkCookie() {
		var user=getCookie("username", document.cookie); //获取用户cookie
		if (user!=""){
			alert("欢迎 " + user + " 再次访问");
		}
		else {
			user = prompt("请输入你的名字:","");
	  		if (user!="" && user!=null){
	    		setCookie("username",user,30); //创建cookie
	    	}
		}
	}
	function addUser(detail) {
		let userDiv = document.createElement('div');
		let portrait = document.createElement('div');
		let username = document.createElement('div');
		username.innerHTML = detail;
		portrait.innerHTML = detail.split('')[0].toUpperCase();
		portrait.className = 'portrait';
		userDiv.className = 'message';
		username.style.marginLeft = '10px';
		userDiv.appendChild(portrait);
		userDiv.appendChild(username);
		document.getElementById('sidebar').appendChild(userDiv);
	}
	function deleUser(detail) {
		let nodes = document.getElementById('sidebar').childNodes;
		nodes.forEach((item) => {
			if(item.childNodes[1]&&item.childNodes[1].innerHTML === detail) {
				document.getElementById('sidebar').removeChild(item);
			}
		})
		
	}
	function updateUserList(message) {
		if(message.type === 'join') {
			addUser(message.detail);
		} else if(message.type === 'left') {
			deleUser(message.detail);
		}
	}
	function initUserList(userList) {
		userList.forEach((username) => {
			addUser(username);
	    })
	}
})();