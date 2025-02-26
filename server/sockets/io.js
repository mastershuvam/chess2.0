module.exports = io => {
    io.on('connection', socket => {
        console.log('New socket connection');

        let currentCode = null;

        socket.on('move', function(move) {
            console.log('move detected');
            io.to(currentCode).emit('newMove', move);
        });

        socket.on('joinGame', function(data) {
            currentCode = data.code;
            socket.join(currentCode);

            if (!games[currentCode]) {
                games[currentCode] = true;
                return;
            }
            
            // Notify all players in the room that an opponent has joined
            socket.broadcast.to(currentCode).emit('playerJoined', 'An opponent has joined the game!');

            io.to(currentCode).emit('startGame');
        });

        socket.on('disconnect', function() {
            console.log('socket disconnected');

            if (currentCode) {
                io.to(currentCode).emit('gameOverDisconnect');
                delete games[currentCode];
            }
        });
    });
};
