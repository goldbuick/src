/*
provides an api for interacting with irc servers and channels
*/

import IRC from 'irc-framework';
import hemera from './sigint-service';

const log = (client, event) => {
    client.on(event, (info) => {
        console.log(event, info);
    });
};

hemera.ready(() => {

    const client = new IRC.Client();
    client.connect({
        host: 'irc.freenode.net',
        port: 6667,
        nick: 'gbbot'
    });

    client.on('connected', () => {
        console.log('connected to irc!');
        client.join('#gb-test');
    });

    log(client, 'channel info');
    log(client, 'channelinfo');
    log(client, 'userlist');
    log(client, 'wholist');
    log(client, 'banlist');
    log(client, 'topic');
    log(client, 'topicsetby');
    log(client, 'message');

});
