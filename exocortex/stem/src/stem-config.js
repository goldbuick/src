
import seneca from 'seneca';
import RethinkDB from './lib/RethinkDB';

const opts = {
    seneca: {
        tag: process.env.STEM_CONFIG_TAG || 'stem-config',
    },
    mesh: {
        bases: (process.env.STEM_MESH_BASES || '').split(','),
    },
    rethinkdb: {
        host: process.env.STEM_CONFIG_R_HOST || 'localhost',
        port: process.env.STEM_CONFIG_R_PORT || 28015,
        db: process.env.STEM_CONFIG_R_DB || 'exo',
        table: process.env.STEM_CONFIG_R_TABLE || 'config',
        ready: () => {

        }
    }
};

let store = { },
    db = new RethinkDB(opts.rethinkdb);

let objPath = str => {
    return (str || '').split('/');
};

seneca(opts.seneca)
    .add('role:config,cmd:set', (args, done) => {
        let path = objPath(args.key);
    })
    .add('role:config,cmd:get', (args, done) => {
        let path = objPath(args.key);
    })
    .add('role:config,cmd:list', (args, done) => {
        let path = objPath(args.key);
    })
    .add('role:config,cmd:remove', (args, done) => {
        
    })
    .use('mesh', opts.mesh)
    .ready(function() { console.log(this.id) })
