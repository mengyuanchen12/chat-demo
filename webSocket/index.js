const WebSocketServer = require('websocket').server;
const chat = require('../service/chat');
const user = require('../service/user');

module.exports = function (server) {
    let wsServer = new WebSocketServer({
        httpServer: server,
        // You should not use autoAcceptConnections for production
        // applications, as it defeats all standard cross-origin protection
        // facilities built into the protocol and the browser.  You should
        // *always* verify the connection's origin and decide whether or not
        // to accept it.
        autoAcceptConnections: false
    });

    wsServer.on('request', function (request) {
        if (!originIsAllowed(request.origin)) {
            // Make sure we only accept requests from an allowed origin
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }

        var connection = request.accept('echo-protocol', request.origin);

        console.log((new Date()) + ' Connection accepted.');
        connection.on('message', function (message) {
            let utfMsg = message.utf8Data;
            let data = JSON.parse(utfMsg);

            if (data.action == 'login' && user.find(data.user)) {
                let result = {
                    user: data.user,
                    status: 0,
                    action: data.action
                };
                return connection.sendUTF(JSON.stringify(result));
            } else if (data.action == 'login') {
                user.add(data.user);
            }

            connection.user = data.user;

            if (data.action == 'sendMessage')
                chat.push(data);

            broadcast(utfMsg);
        });

        connection.on('close', function (reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            let result = {
                user: connection.user,
                action: 'logout',
                time: new Date()
            };
            broadcast(JSON.stringify(result)); 
        });
    });

    //广播, 发送信息给所有连接用户
    function broadcast(message) {
        for (let i = 0; i < wsServer.connections.length; i++) {
            if (wsServer.connections[i] === wsServer.connection)
                return;
    
            wsServer.connections[i].sendUTF(message);
        }
    }

};

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}
