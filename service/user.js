let User = function () {
    this.names = [];
};

User.prototype = {
    find: function (name) {
        return this.names.includes(name);
    },
    add: function (name) {
        this.names.push(name);
    },
    remove: function (name) {
        let index = this.names.findIndex(name);
        this.names.splice(index, 1);
    }
};

module.exports = new User();



// const _ = require('underscore');
// const dbFactory = require('../db-factory');

// let User = function () {
//     this.names = {};
// };

// User.prototype = {
//     find: function (callback) {
//         if (_.size(this.names))
//             return callback(null, this.names);

//         dbFactory.db('user').find((err, rows) => {
//             if (err)
//                 return callback(err);

//             this.names = _.chain(rows).map(r => [r.id, r.name]).object().value();
//             callback(null, this.names);
//         });
//     },
//     add: function (user, callback) {
//         let entity = {
//             id: dbFactory.newId(),
//             name: user.name
//         };

//         this.names[entity.id] = entity.name;
//         dbFactory.db('user').add(entity, err => callback(err, entity.id));
//     },
//     check: function (user) {
//         return Object.values(this.names).includes(user.name)
//     }
// };

// module.exports = new User();