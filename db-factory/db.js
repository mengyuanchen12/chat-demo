const async = require('async');
const fs = require('fs');
const path = require('path');
const _ = require('underscore');

let Db = function (table) {
    let modelpath = path.join(__dirname, '..', 'models', `${table}.js`);
    if (!fs.existsSync(modelpath))
        throw new Error(`${table} 模型不存在`);

    this.table = table;
    this.model = require(modelpath);
    this.filepath = path.join(__dirname, '..', 'files', `${this.table}.json`);
};

Db.prototype = {
    find: function (callback) {
        if (fs.existsSync(this.filepath)) {
            fs.readFile(this.filepath, 'utf8', (err, rows) => callback(err, JSON.parse(rows)));
        } else {
            this.writeFile([], err => callback(err, []));
        }
    },
    save: function (entity, callback) {
        async.waterfall([
            fn => this.find(fn),
            (rows, fn) => {
                let pk = _.findKey(this.model, (r, k) => r.isPk);
                let index = _.findIndex(rows, r => r[pk] = entity[pk]);
                if (index < 0)
                    return fn('无可修改数据');
                
                let row = rows[index];

                rows[index] = _.reduce(this.model, (memo, v, k) => {
                    memo[k] = entity[k] === void 0 ? row[k] : entity[k];
                    return memo;
                }, {});

                this.writeFile(rows, fn);
            }
        ], callback);
    },
    remove: function (entity, callback) {
        async.waterfall([
            fn => this.find(fn),
            (rows, fn) => {
                let pk = _.findKey(this.model, (r, k) => r.isPk);
                let row = _.find(rows, r => r[pk] = entity[pk]);
                if (!row)
                    return fn();

                rows = _.without(rows, row);
                this.writeFile(rows, fn);
            }
        ], callback);
    },
    add: function (entity, callback) {
        async.waterfall([
            fn => this.find(fn),
            (rows, fn) => {
                let pk = _.findKey(this.model, (r, k) => r.isPk);
                if (!entity[pk])
                    return fn('未设置主键');

                let row = _.reduce(this.model, (memo, v, k) => {
                    memo[k] = entity[k] || '';
                    return memo;
                }, {});

                rows.push(row);
                this.writeFile(rows, fn);
            }
        ], callback);
    },
    writeFile: function (rows, callback) {
        fs.writeFile(this.filepath, JSON.stringify(rows), 'utf8', callback);
    }
};

module.exports = Db;
