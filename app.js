const express = require("express");
const app = express();

const socketIO = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = socketIO(server);
const unames = [];
const userids = [];

io.on("connection", function (socket) {
    console.log("Socket.io connection established");
    console.log("User connected with id: ", socket.id);

    socket.on("message", function (message) {
        let index = userids.indexOf(socket.id);
        if (index !== -1) {
            let name = unames[index];
            io.emit("message", { message, name, id: socket.id });
            console.log("User sent message: ", message);
        }
    });

    socket.on("typing", function () {
        let index = userids.indexOf(socket.id);
        if (index !== -1) {
            let name = unames[index];
            socket.broadcast.emit("typing", { name });
            console.log("User is typing...");
        }
    });

    socket.on("uname", function (name) {
        unames.push(name);
        userids.push(socket.id);
        socket.emit("setnamedone");
        io.emit("countofpeople", unames);
        console.log("User set name: ", name);
        console.log("User count updated: ", unames.length);
    });

    socket.on("disconnect", function () {
        let index = userids.indexOf(socket.id);
        if (index !== -1) {
            unames.splice(index, 1);
            userids.splice(index, 1);
            io.emit("countofpeople", unames);
            console.log("User disconnected with id: ", socket.id);
            console.log("User count updated: ", unames.length);
        }
    });
});

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("index");
});

server.listen(3000);
