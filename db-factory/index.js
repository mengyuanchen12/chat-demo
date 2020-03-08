const Db = require('./db');

const letters = 'abcdefghijklmnopqrstuvwxyz123456789';

let DbFactory = function () {};

DbFactory.prototype = {
    init: function (config, callback) {
        
    },
    db: function (table) {
        return new Db(table);
    },
    newId: function () {
        let id = Math.floor(Date.now() / 1000).toString(16);
        for (let i = 0; i < 8; i++) {
            let index = Math.round(Math.random() * 35);
            id += letters[index];
        }
        return id;
    }
};

module.exports = new DbFactory();