const express = require("express");
const app = express();

const soketIO = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = soketIO(server);
const unames = [];
const userids = [];

io.on("connection",function(socket){
    socket.on("message",function(message){
        let index = userids.indexOf(socket.id);
        let name = unames[index];
        io.emit("message",{message,name,id:socket.id});
    })
    socket.on("typing",function(){
        let index = userids.indexOf(socket.id);
        let name = unames[index];

        socket.broadcast.emit("typing",{name});
    })
    socket.on("uname",function(name){
        unames.push(name);
        userids.push(socket.id);
        socket.emit("setnamedone");
        io.emit("countofpeople",unames.length);
    })
    socket.on("disconnect",function(){
        let index = userids.indexOf(socket.id);
        unames.splice(index,1);
        io.emit("countofpeople",unames.length);
    })
})

app.set("view engine","ejs");

app.get("/",function(req,res){
    res.render("index");
});

server.listen(3000);