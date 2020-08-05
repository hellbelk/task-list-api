import {Server} from 'ws';
import {Message} from '../model/message';

export class EventsGateway {
    sockets = [];
    constructor() {
        const server = new Server({port: 8080})
        server.on('connection', ws => {
            this.sockets.push(ws);
            ws.on('message', message => {
                console.log(message);
            });

            ws.on('close', () => {
                const index = this.sockets.indexOf(ws);
                if (index !== -1) {
                    this.sockets.splice(index, 1);
                }
            })
        });
    }

    broadcast(message: Message) {
        if (this.sockets.length) {
            this.sockets.forEach(ws => {
                ws.send(JSON.stringify(message));
            })
        }
    }


}