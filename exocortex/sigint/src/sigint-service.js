import './lib/env';
import nats from 'nats';
import Hemera from 'nats-hemera';

const connection = nats.connect({
    url: process.env.NATS_URL,
    user: process.env.NATS_USER,
    pass: process.env.NATS_PW,
});

const hemera = new Hemera(connection, {
    logLevel: process.env.HEMERA_LOG_LEVEL,
});

export default hemera;

/*
we have two forms of coms
1. pub/sub event handling
2. api handlers for microservices
*/
