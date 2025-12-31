var io = require('socket.io-client')
var tbh = require('trollbox-headers').headers()
var address = "http://www.windows93.net:8081";
var fs = require('fs')
var path = require('path')
var he = require('he');
var started = false
var D = {
  prefix = "-",
  commands = {},
  onmessagecommands = [],
  onuserleftcommands = [],
  onuserjoinedcommands = [],
  currentname = "",
  currentcolor = "",
  socket = ""
}

function connect(json) {
  D.currentname = json.name
  D.currentcolor = json.color

  exports.users = {}
  D.socket = io(address, tbh);
  exports.updatecolor= function(color) {
    console.log("Updating color")
    D.socket.emit('user joined', D.currentname, json.color,"beepboop","")
    D.currentcolor = json.color
  }
  exports.updatename= function(name) {
    console.log("Updating name")
    D.socket.emit('user joined', name, D.currentcolor,"beepboop","")
    D.currentname = json.name
  }
  D.socket.on('_connected', function(data){
    D.socket.emit('user joined', json.name, json.color,"beepboop","")
    if(json.welcome){
      D.socket.send(json.welcome)
    }
    D.prefix = json.prefix
    started = true
    exports.onconnect(D.socket)
  })
  socket.on('disconnect', function(data) {
    console.log("Failed to connect, retrying...")
    var started = false
    D.prefix = "-"
    D.commands = {}
    D.onmessagecommands = []
    D.onuserleftcommands = []
    D.onuserjoinedcommands = []
    D.currentname = ""
    D.currentcolor = ""
    D.socket = "";
    connect(name, color, prefix, welcomemsg)
  });
  socket.on('user joined', function(data) {
    for (let index = 0; index < D.onmessagecommands.length; index++) {
      setTimeout(() => {
        D.onmessagecommands[index](data);
      }, 1);
    }
  });
  socket.on('user left', function(data) {
    for (let index = 0; index < D.onuserleftcommands.length; index++) {
      setTimeout(() => {
        D.onuserleftcommands[index](data);
      }, 1);
    }
  });
  
  socket.on('update users', function (data) {
  
    users={};
    for (var key in data) {
      if (!users[data[key].home]) {
        users[data[key].nick] = data[key]
      }else{
        users[data[key].nick] = data[key]
      }
    exports.users = users
  }});
  
  var uses = 0
  socket.on('message', function(data) {
    try{
      if(String(data)){
        data.color = he.decode(data.color)
        data.msg = he.decode(data.msg)
        data.home = he.decode(data.home)
        data.nick = he.decode(data.nick).replace(/discord/g,"").replace(/hugs/g,"")
      
        for (let index = 0; index < D.onmessagecommands.length; index++) {
          setTimeout(() => {
            D.onmessagecommands[index](data);
          }, 1);
        }
      
        if (!started) return;
        if (data.msg.startsWith(D.prefix)) {
          file = data.msg.toLowerCase().slice(D.prefix.length).split(' ')[0]
          if(commands[file]){
            commands[file](data, socket)
          }
        }
        
      }
    }catch {
      console.log("Error while reading message")
    }
  })
}

exports.connect = function(json) {
  connect(json)
}

exports.updateprefix = function(newprefix){
  D.prefix = newprefix
}

exports.setcommand = function(command,func){
  commands[command] = func
}

exports.onmessage = function(func) {
  D.onmessagecommands.push(func)
}

exports.onuserjoined = function(func) {
  D.onuserjoinedcommands.push(func)
}
exports.onuserleft= function(func) {
  D.onuserleftcommands.push(func)
}