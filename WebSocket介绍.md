# WebSocket

#### 什么是WebSocket

WebSocket是Web下的TCP，一个底层的双向socket，允许用户对消息传递进行控制。

每次提到WebSocket的时候，其实在讲两部分内容：一部分是浏览器实现的WebSocket API，另一部分是服务端实现的WebSocket协议。这两部分是随着HTML5的推动一起被设计和开发的，但是两者都没有成为HTML5标准的一部分。前者被W3C标准化了，而后者被IETF标准化为RFC 6455。

#### 背景

很多网站为了实现推送技术，所用的技术都是轮询。轮询是在特定的的时间间隔（如每1秒），由浏览器对服务器发出HTTP请求，然后由服务器返回最新的数据给客户端的浏览器。这种传统的模式带来很明显的缺点，即浏览器需要不断的向服务器发出请求，然而HTTP请求可能包含较长的头部，其中真正有效的数据可能只是很小的一部分，显然这样会浪费很多的带宽等资源。

在这种情况下，WebSocket能更好的节省服务器资源和带宽，并且能够更实时地进行通讯。

#### 与HTTP的区别

WebSocket还是建立在HTTP之上的，对于现有的服务器来说，实现WebSocket协议非常容易。它和HTTP之间的主要的区别就是，握手完成后，客户端和服务器端就建立了类似TCP socket这样的通道。

客户端和服务器端的WebSocket 连接建立之后，双方就可以通过这个连接通道自由的传递信息，并且这个连接会持续存在直到客户端或者服务器端的某一方主动关闭连接。

#### HTML5 WebSocket

首先，连接必须通过握手来建立。握手方面和普通的HTTP请求类似，但在服务器端响应后，客户端和服务器端收发数据时，数据本身之外的信息非常少。

浏览器向服务器发送请求，表明它希望将协议从HTTP切换到WebSocket。客户端通过Upgrade标头表达其愿望：

    GET ws://echo.websocket.org/?encoding=text HTTP/1.1
    Origin: http://websocket.org
    Cookie: __utma=99as
    Connection: Upgrade
Host: echo.websocket.org
Sec-WebSocket-Key: uRovscZjNol/umbTt5uKmw==
Upgrade: websocket
Sec-WebSocket-Version: 13

- Connection 必须设置 Upgrade，表示客户端希望连接升级。
- Upgrade 字段必须设置 Websocket，表示希望升级到 Websocket 协议。
- Sec-WebSocket-Key 是随机的字符串，服务器端会用这些数据来构造出一个 SHA-1 的信息摘要。把 “Sec-WebSocket-Key” 加上一个特殊字符串 “258EAFA5-E914-47DA-95CA-C5AB0DC85B11”，然后计算 SHA-1 摘要，之后进行 BASE-64 编码，将结果做为 “Sec-WebSocket-Accept” 头的值，返回给客户端。如此操作，可以尽量避免普通 HTTP 请求被误认为 Websocket 协议。
- Sec-WebSocket-Version 表示支持的 Websocket 版本。RFC6455 要求使用的版本是 13，之前草案的版本均应当弃用。
- Origin 字段是可选的，通常用来表示在浏览器中发起此 Websocket 连接所在的页面，类似于 Referer。但是，与 Referer 不同的是，Origin 只包含了协议和主机名称。
- 其他一些定义在 HTTP 协议中的字段，如 Cookie 等，也可以在 Websocket 中使用。

如果服务器识别WebSocket协议，则同意通过Upgrade标头切换协议

    HTTP/1.1 101 WebSocket Protocol Handshake
    Date: Fri, 10 Feb 2012 17:38:18 GMT
    Connection: Upgrade
    Server: Kaazing Gateway
Upgrade: WebSocket
Access-Control-Allow-Origin: http://websocket.org
Access-Control-Allow-Credentials: true
Sec-WebSocket-Accept: rLHCkw/SKsO9GAH/ZSFhBATDKrU=
Access-Control-Allow-Headers: content-type

此时，HTTP连接中断，并由同一底层TCP / IP连接上的WebSocket连接替换。默认情况下，WebSocket连接使用与HTTP（80）和HTTPS（443）相同的端口。

##### 建立连接

```javascript
var Socket = new WebSocket(url, [protocol] );
```

第一个参数 url, 指定连接的 URL，协议标识符是ws（如果加密，则为wss），类似于HTTP和HTTPS。第二个参数 protocol 是可选的，指定了可接受的子协议。

##### 属性

| 属性                    | 描述                                                              |
| --------------------- | --------------------------------------------------------------- |
| Socket.readyState     | 只读属性 readyState 表示连接状态，可以是以下值：                                  |
|                       | 0 - 表示连接尚未建立。                                                   |
|                       | 1 - 表示连接已建立，可以进行通信。                                             |
|                       | 2 - 表示连接正在进行关闭。                                                 |
|                       | 3 - 表示连接已经关闭或者连接不能打开。                                           |
| Socket.bufferedAmount | 只读属性 bufferedAmount 已被 send() 放入正在队列中等待传输，但是还没有发出的 UTF-8 文本字节数。 |

##### 事件

| 事件      | 事件处理程序           | 描述            |
| ------- | ---------------- | ------------- |
| open    | Socket.onopen    | 连接建立时触发       |
| message | Socket.onmessage | 客户端接收服务端数据时触发 |
| error   | Socket.onerror   | 通信发生错误时触发     |
| close   | Socket.onclose   | 连接关闭时触发       |

##### 方法

| 方法             | 描述       |
| -------------- | -------- |
| Socket.send()  | 使用连接发送数据 |
| Socket.close() | 关闭连接     |

#### WebSocket-Node

```javascript
var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    response.writeHead(404);
    response.end();
});

server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {

      // put logic here to detect whether the specified origin is allowed.
      return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
    request.reject();
    return;
}

var connection = request.accept('echo-protocol', request.origin);
console.log((new Date()) + ' Connection accepted.');

connection.on('message', function(message) {
    if (message.type === 'utf8') {
        connection.sendUTF(message.utf8Data);
    }
    else if (message.type === 'binary') {
        connection.sendBytes(message.binaryData);
    }
});

connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
```

#### 聊天室demo实现

1. 可输入用户名，登录成功后广播到已连接的客户端

2. 用户发送消息，已连接的客户端均可收到该消息

3. 用户退出后，已连接的客户端均可收到该用户退出消息

[demo地址](http://192.168.1.161:8080"demo地址")

#### 参考

《了不起的Nodejs将JavaScript进行到底》

[WebSocket-Node](https://github.com/theturtle32/WebSocket-Node/ "WebSocket-Node")

[HTML5 WebSocket](http://websocket.org/echo.html "HTML5 WebSocket")
