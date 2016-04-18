"use strict";

var HOST = "http://" + window.location.host;
var socket = io.connect(HOST);

socket.on("event", function(msg){
    console.log(msg);
});

socket.on("connection", function(){
    console.log("Hello");
});