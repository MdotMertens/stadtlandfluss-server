const WebSocket = require('ws');

const wss = new WebSocket.Server({port: 8080});

const games = {}
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        //Try to parse message
        // If we fail it's the clients fault
        try {
            message = JSON.parse(message)
        } catch (e) {
            ws.send(e.toString())
        }
        if (message.action === "createGame") {
            const payload= {
                gameId: message.gameId,
            }
            games[message.gameId] = payload
            ws.send(JSON.stringify(payload))
        }

        if(message.action === "getGame"){
            const payload = {
                game: games[message.gameId]
            }
            console.log(payload.game)
            ws.send(JSON.stringify(payload))
        }

        if(message.action === "joinGame"){
            games[message.game.gameId] = message.game
            const payload = {
                action: "updateGame",
                game: games[message.game.gameId]
            }
            ws.send(JSON.stringify(payload))
        }
    });
});