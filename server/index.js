const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const PORT = process.env.PORT || 4001;

const router = require('./router');
const app = express();
const server = http.createServer(app);
// const io = socketio(server);

// app.use(cors());
// io.origins('*:*');
app.use(cors());

const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000', // react url
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) {
      if (typeof callback === 'function') {
        callback(error);
      }
      return;
    }

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to the ${user.room} room!!`,
    });

    /*
    |--------------------  
    |BroadCast
    |--------------------
     */
    socket.broadcast
      .to(user.room)
      .emit('message', { user: 'admin', text: `${user.name}, has joined!!` });

    socket.join(user.room);

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    if (callback) {
      callback();
    }
  });

  /*socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });*/

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    if (!user) {
      console.log('User not found');
      return;
    }

    io.to(user.room).emit('message', { user: user.name, text: message });
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name}, has left.`,
      });
    }
  });
});

app.use(router);

server.listen(PORT, () =>
  console.log(`Server running on network http://localhost:${PORT}`)
);
