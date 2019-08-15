#### 基于WebSocket实现的简易聊天室

### 技术栈
* 协议层：WebSocket
* 服务器：Node.js并引用第三方库[ws](https://github.com/websockets/ws)
* 客户端：原生js

### 功能
* 即时聊天，仅支持文字、emoji
* 支持cookie身份验证，无需登录注册，第一次进入页面设置用户名即可，cookie过期即用户名失效，也可以手动在浏览器删除cookie
* 右侧展示所有已经连接的所有用户的用户名
* 有用户退出和加入的系统提醒
* 有头像展示，头像是用户名的首字母大写生成的
* ![](http://ww1.sinaimg.cn/large/006XqmrNly1g60gajj4xmj31di15gdip.jpg)

### 难点
* 用户身份的判定：利用cookie,但是由于WebSocket是一种长连接的协议，本身不需要cookie记录连接状态，所以在其报文中并不会自动带cookie，需要手动带，可以选择带在报文头，此处的方案是携带在发送的message信息中。message只能是string类型，所以首先将message构造成对象，在传输是转为字符串，解析时再转为对象
* 如何监听用户的离开和进入：用户手动关闭页面或者刷新都会造成断开连接，断开连接即为离开聊天室，在客户端需要处理的是，在`window.onbeforeunload`触发时，向服务器发送一条message，告知该用户的信息，服务器再将这条信息转发给所有已经连接的用户。服务器发送的信息与客户端发送的信息用专门字段区分