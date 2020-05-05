const express = require('express');
const http = require('http');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));

var server = http.createServer(app);

server.listen(8081, () => console.log((new Date()) + ' Server is listening on port 8081'));

require('./webSocket')(server);
