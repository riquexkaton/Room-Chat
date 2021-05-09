const express = require('express');
const path= require("path");
const app = express();
const http = require('http');
const cors = require("cors");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


//usuarios conectados
let users = [];
let id = 0;
let rooms = [];

io.on("connection", socket => {

  //nuevos usuarios
  socket.on("new-user", user => {
    users.push(user);
  });

  //nueva sala
  socket.on("new-room", room => {
    const newSala = {
      roomName: room.roomName,
      idUser: room.idUser,
      id_room: id,
      roomImg: room.imgRoom,
      imgUser: room.imgUser,
      userName: room.createdBy,
      description:room.description,
      messages: []
    };
    rooms.push(newSala);
    id++;
    io.emit("new-room", newSala);
  });
  //cargar las salas disponibles 
  io.emit("charge-rooms", rooms);

  //nuevo-mensaje
  socket.on("message", msg => {
    io.to(msg.id_room).emit("message", msg);
    rooms.forEach(item => {
      if (item.id_room == msg.id_room) {
        item.messages.push(msg);
      }
    });
  });

  //unirse a una sala
  socket.on("join-room", id => {
    socket.join(id);
    const searchDataRoom = rooms.filter(item => {
      return item.id_room == id;
    });
    io.to(id).emit("join-room", searchDataRoom[0]);
    const searchMessages = rooms.filter(item => {
      return item.id_room == id;
    });
    io.to(id).emit("charge-messages", searchMessages[0].messages);
  });

  //salir de la app
  socket.on("logout", async id => {
    const searchRooms = rooms.filter(item => {
      return item.idUser != id;
    });
    rooms=searchRooms;
    io.emit("logout",rooms);
  });

});

app.use(cors());
app.use(express.static(path.join(__dirname,"..","frontend","my-app","src","public")));
server.listen(4000, () => {
  console.log('listening on *:4000');
});