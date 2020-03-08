let assert = require('assert');
let self = require(__filename.replace('_test', ''));

describe('./index.js', () => {
    describe.skip('newId()', () => {
        
        it('ok', () => {
            let id = self.newId();
            assert.ok(id);
            assert.equal(id.length, 16);
        });
    });

    describe.skip('find()', () => {
        it('ok', done => {
            self.db('user').find((err, rows) => {
                console.log(rows);
                assert.ok(rows);
                done(err);
            });
        });
    });

    describe.skip('add()', () => {
        it('ok', done => {
            // self.db('user').add({
            //     id: self.newId(),
            //     name: 'test'
            // }, done);

            self.db('room').add({
                id: self.newId(),
                name: 'default',
                createdOn: Date.now()
            }, done);
        });
    });

    describe.skip('save()', () => {
        it('ok', done => {
            self.db('user').save({
                id: '5d42a115vylkprgp',
                name: 'aaa',
                email: '352499619@qq.com'
            }, done);
        });
    });

    describe.skip('remove()', () => {
        it('ok', done => {
            self.db('user').remove({
                id: '5d42a115vylkprgp',
                name: '111'
            }, done);
        });
    });
});