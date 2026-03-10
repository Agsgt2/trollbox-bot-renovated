var io = require('socket.io-client')
var tbh = require('trollbox-headers').headers()
var address = "http://v2.windows93.net:8081";
var fs = require('fs')
var path = require('path')
var he = require('he');
var started = false
var D = {
  prefix: "-",
  commands: {},
  onmessagecommands: [],
  onuserleftcommands: [],
  onuserjoinedcommands: [],
  currentname: "",
  currentcolor : "",
  socket: ""
}

function connect(json: {name: string; color: string; prefix: string; welcome?: string;}) {
  D.currentname = json.name
  D.currentcolor = json.color

  exports.users = {}
  D.socket = io(address, tbh);
  exports.color= function(color: string) {
    if (color){
      console.log("Updating color")
      D.socket.emit('user joined', D.currentname, json.color,"beepboop","")
      D.currentcolor = color
    } else {
      return D.currentcolor;
    }
  }
  exports.name= function(name: string) {
    if (color){
      console.log("Updating name")
      D.socket.emit('user joined', name, D.currentcolor,"beepboop","")
      D.currentname = name
    } else {
      return D.currentname;
    }
  }
  D.socket.on('_connected', function(data: [x: string]: unknown){
    D.socket.emit('user joined', json.name, json.color,"beepboop","")
    if(json.welcome){
      D.socket.send(json.welcome)
    }
    D.prefix = json.prefix
    started = true
    exports.onconnect(D.socket)
  })
  socket.on('disconnect', function(data: [x: string]: unknown) {
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
  socket.on('user joined', function(data: [x: string]: unknown) {
    for (let index = 0; index < D.onmessagecommands.length; index++) {
      setTimeout(() => {
        D.onmessagecommands[index](data, socket);
      }, 1);
    }
  });
  socket.on('user left', function(data: [x: string]: unknown) {
    for (let index = 0; index < D.onuserleftcommands.length; index++) {
      setTimeout(() => {
        D.onuserleftcommands[index](data, socket);
      }, 1);
    }
  });
  
  socket.on('update users', function (data: [x: string]: unknown) {
  
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
  socket.on('message', function(data: [x: string]: unknown) {
    try{
      if(String(data)){
        data.color = he.decode(data.color)
        data.msg = he.decode(data.msg)
        data.home = he.decode(data.home)
        data.nick = he.decode(data.nick).replace(/discord/g,"").replace(/hugs/g,"")
      
        for (let index = 0; index < D.onmessagecommands.length; index++) {
          setTimeout(() => {
            D.onmessagecommands[index](data, socket);
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

exports.connect = function(json: [x: string]: unknown) {
  connect(json)
}

exports.updateprefix = function(newprefix: string){
  D.prefix = newprefix
}

exports.setcommand = function(command: string,func: [x: string]: unknown){
  commands[command] = func
}

exports.onmessage = function(func: [x: string]: unknown) {
  D.onmessagecommands.push(func)
}

exports.onuserjoined = function(func: [x: string]: unknown) {
  D.onuserjoinedcommands.push(func)
}
exports.onuserleft= function(func: [x: string]: unknown) {
  D.onuserleftcommands.push(func)
}
