import r from 'rethinkdb';

function check (err) {
    if (!err) return false;
    console.log('rethinkdb error', err);
    return true;
}

class RethinkDB {

    constructor({ host, port, db, table, ready } = {}) {
        this.db = db;
        this.table = table;
        this.conn = undefined;
        r.connect({
            host,
            port,
            db
        }, (err, conn) => {
            if (check(err)) return;

            this.conn = conn;
            r.dbCreate(this.db).run(conn, err => {
                r.tableCreate(this.table).run(conn, err => {
                    console.log('rethinkdb connected', this.db, this.table);
                    if (ready) ready.call(this);
                });
            });
        });
    }

    q() {
        return r.table(this.table);
    }

    run(qobj, callback) {
        qobj.run(this.conn, callback);
    }

    check(err) {
        return check(err);
    }

}

export default RethinkDB;
