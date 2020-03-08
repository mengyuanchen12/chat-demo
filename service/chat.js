const _ = require('underscore');
const dbFactory = require('../db-factory');

let Chat = function () {
    this._queue = [];
    this._active = false;
};

Chat.prototype = {
    push: function (data) {
        this._queue.push(data);
        this.saveMessage();
    },
    saveMessage: function () {
        if (this._active)
            return;

        if (!this._queue.length)
            return this._active = false;

        this._active = true;
        let data = this._queue.shift();

        dbFactory.db('message').add({
            id: dbFactory.newId(),
            roomId: data.roomId || '5d47fffd1uk7tsvr',
            content: data.content,
            createdBy: data.user,
            createdOn: new Date(data.time).getTime()
        }, err => {
            if (err) console.error('保存message失败');

            console.log(`${data.user} 保存message成功`);
            this._active = false;
            this.saveMessage();
        });
    },
    getMessage: function (callback) {
        dbFactory.db('message').find((err, rows) => {
            if (err)
                return callback(err);

            callback(null, _.sortBy(rows, 'createdOn'));
        });
    }
};

module.exports = new Chat();