
import net from 'net';
import irc from 'slate-irc';

let stream = net.connect({
    port: 6667,
    host: 'irc.freenode.org'
});

let client = irc(stream);

client.nick('proxygoldbuick');
client.user('proxygoldbuick', 'Proxy for Goldbuick');

client.join('#exocortex');
client.names('#exocortex', (err, names) => {
    console.log(names);
});
