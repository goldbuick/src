/*
this provides the bridge between sigint and didact
1. pub/sub event handling - socket.io
2. api handlers for microservices - hapi
*/
import Hapi from 'hapi';
import Boom from 'boom';
import nats from 'nats';
import dotenv from 'dotenv';
import SocketIO from 'socket.io';
import Hemera from 'nats-hemera';
import HapiHemera from 'hapi-hemera';

const result = dotenv.config();
if (result.error) throw result.error;

const server = new Hapi.Server();
server.connection({
    port: process.env.GATEWAY_PORT,
    host: process.env.GATEWAY_HOST,
});

const pubsub = SocketIO(server.listener);
pubsub.on('connection', (client) => {
    // spool up a hemera instance per client
    // that way when the client disconnects
    // we can dump the pubsubs for that client ?
    const connection = nats.connect({
        url: process.env.NATS_URL,
        user: process.env.NATS_USER,
        pass: process.env.NATS_PW,
    });

    const hemera = new Hemera(connection, {
        logLevel: process.env.HEMERA_LOG_LEVEL,
    });

    client.on('add', (pattern) => {
        // subscribe
        hemera.add({
            pubsub$: true,
            ...pattern,
        }, (message) => {
            client.emit('message', message);
        });
    });

    client.on('act', (message) => {
        // publish
        hemera.act({
            pubsub$: true,
            ...message,
        });
    });

    client.on('disconnect', () => {
        // destroy hemera instance
        hemera.close();
    });
});

server.register({
    register: HapiHemera,
    options: {
        hemera: {
            logLevel: process.env.HEMERA_LOG_LEVEL,
        },
        nats: {
            url: process.env.NATS_URL,
            user: process.env.NATS_USER,
            pass: process.env.NATS_PW,
        },
    },
}, (err) => {
    if (err) {
        console.error(err);
        throw err;
    }

    server.start((err) => {
        if (err) {
            console.error(err);
            throw err;
        }
        console.log(`Server running at: ${server.info.uri}`);
    });
});

server.route({
    method: 'POST',
    path: '/act/{topic}/{cmd}',
    handler: (request, reply) => {
        console.log(request);
        reply('');
    },
});
