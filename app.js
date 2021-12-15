const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require('socket.io')(server);

app.set("view engine", "ejs");
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.send("hello");
});

app.get("/:visio", (req, res) => {
    res.render("visio" , { roomId: req.params.room });
});

io.on("connection", (socket) => {
    socket.on("join-room" , (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId);
    })    
});

server.listen();