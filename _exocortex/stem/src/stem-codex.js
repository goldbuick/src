
import seneca from 'seneca';

const opts = {
    seneca: {
        tag: process.env.STEM_CODEX_TAG || 'stem-codex',
    },
    mesh: {
        bases: (process.env.STEM_FACADE_BASES || '').split(','),
    },
    // rethinkdb: {
    //     host: process.env.STEM_CONFIG_R_HOST || 'localhost',
    //     port: process.env.STEM_CONFIG_R_PORT || 28015,
    //     db: process.env.STEM_CONFIG_R_DB || 'exo',
    //     table: process.env.STEM_CONFIG_R_TABLE || 'codex',
    //     ready: () => {

    //     }
    // }
};

// let store = { },
//     db = new RethinkDB(opts.rethinkdb);

// let objPath = str => {
//     return (str || '').split('/');
// };

seneca(opts.seneca)
    .add('role:codex,cmd:set', (args, done) => {
        console.log(args);
        // let path = objPath(args.key);
    })
    .add('role:codex,cmd:get', (args, done) => {
        console.log(args);
        // let path = objPath(args.key);
    })
    .add('role:codex,cmd:list', (args, done) => {
        console.log(args);
        // let path = objPath(args.key);
    })
    .add('role:codex,cmd:remove', (args, done) => {
        console.log(args);
    })
    .use('mesh', opts.mesh)
    .ready(function() { console.log(this.id) })
