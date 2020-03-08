$(function () {
    let wsUri = 'ws://localhost:8081/websocket';

    function testWebSocket() {
        websocket = new WebSocket(wsUri, 'echo-protocol');
        websocket.onopen = onOpen;
        websocket.onclose = onClose;
        websocket.onmessage = onMessage;
        websocket.onerror = onError;
    }

    function onOpen(evt) {
        writeToScreen("CONNECTED");
    }

    function onClose(evt) {
        writeToScreen("DISCONNECTED");
    }

    function onMessage(evt) {
        let data = JSON.parse(evt.data);
        console.log(data);
        if (!data.status)
            writeToScreen(data);
        else {
            alert('用户名已存在');
            $('#login-modal').show();
        }
    }

    function onError(evt) {
        writeToScreen(evt.data);
    }

    function doSend(data) {
        let message = JSON.stringify(data);
        websocket.send(message);
    }

    function writeToScreen(message) {
        let color = '';

        let action = message.action;
        let isSelf = message.user == $('#user').val();

        if (action && isSelf)
            color = 'green';
        else if (action)
            color = 'blue';

        let dt = new Date(message.time).toLocaleTimeString();
        let text = action ? `${message.user}(${dt}): ${action == 'sendMessage' && message.content || '' }` : message;

        if ($('#output').children().length > 20) {
            $('#output').find('p:first').remove();
        }

        $('#output').append($('<p class="is-right"></p>'));
        $('#output').find('p:last').css('color', color);
        
        $('#output').find('p:last').text(text);
    }

    function sendMessage() {
        if (!$('#content').val()) {
            $('#content').focus();
            return alert('内容不能为空');
        }

        let data = {
            time: new Date(),
            content: $('#content').val(),
            user: $('#user').val(),
            action: 'sendMessage'
        };

        doSend(data);
        $('#content').val('').focus();
    }

    testWebSocket();

    $('#send-btn').click(function () {
        sendMessage();
    });

    $('#content').keydown(function (e) {
        if (e.keyCode == 13) sendMessage();
    });

    $('#login-btn').click(function () {
        if (!$('#user').val())
            return alert('请输入用户名');

        // if (!$('#password').val())
        //     return alert('请输入密码');

        doSend({
            user: $('#user').val(),
            password: $('#password').val(),
            action: 'login',
            time: new Date()
        });

        $('#login-modal').hide();
    });

    $('#output').height($(document).height() - $('#nav-main').height() - $('#navbar-bottom').height());
})