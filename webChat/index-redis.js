var app = require('express')();
var express = require('express');
var path = require('path')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4000;

var multer  = require('multer');


var redis = require("redis");

// io.set('heartbeat timeout', 4 * 60);
// io.set('heartbeat interval', 2 * 60);

var users = redis.createClient();
var clients = redis.createClient();
var usersNews = redis.createClient();
var clientsNews = redis.createClient();

app.use(express.static(path.join(__dirname+'/public')));

var storage = multer.diskStorage({
    //设置上传后文件路径，uploads文件夹会自动创建。
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname+'/public/uploads'))
    },
    //给上传文件重命名，获取添加后缀名
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        var postfix = fileFormat[fileFormat.length - 1];
        if(postfix!='jpg'||postfix!='png')
        {
            postfix='jpg';
        }
        cb(null, file.fieldname + '-' + Date.now() + "." + postfix);
    }
});
var upload = multer({ storage:storage });

app.use('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

app.get('/user', function(req, res){
  res.sendFile(path.join(__dirname + '/user.html'));
});
app.get('/client', function(req, res){
  res.sendFile(path.join(__dirname + '/client.html'));
});

app.post('/user', upload.single('file'), function (req,res) {
  console.log(req.body);
  console.log(req.file);
  var url = 'http://wxarpt.pjnice.com:8081/uploads/' + req.file.filename;
  // var data = JSON.parse(req.body.data);
  // var client = clients[data.clientId];
  // var msg = 'client off line';
  var msg = 'ok';

  // data.photo = url;

  // if(client) {
  //   console.log('user 图片', data)
  //   msg = 'client on line';
    // client.emit('user news', data);
  // }
  res.json({code: 1, url: url, msg: msg});
})

app.post('/client', upload.single('file'), function (req,res) {
  console.log(req);
  console.log(req.body);
  console.log(req.file);
  var url = 'http://wxarpt.pjnice.com:8081/uploads/' + req.file.filename;
  // var data = JSON.parse(req.body.data);
  // var user = users[data.uuid];
  var msg = 'ok';

  // data.photo = url;

  // if(user) {
  //   console.log('client 图片', data)
  //   msg = 'user on line';
    // user.emit('client news', data);
  // }
  res.json({code: 1, url: url, msg:msg});
})

// var users = {};
// var clients = {};

// var userName = {};
// var clientName = {};

var expireTime = parseInt((+new Date)/1000) + 86400;

io.on('connection', function(socket){
  console.log('connection', socket.id)
  socket.emit('connect succes', '连接成功')
  socket.on('AR', function(data){
    clientName[socket.id] = {
      clientId: data.clientId
    };
    data = JSON.parse(data);
    // clients[data.clientId] = socket;
    socket.clientId = data.clientId;
    var socketStr = JSON.stringify(socket);
    clients.set(data.clientId, socketStr, function (e, v) {});

    usersNews.lrange(data.clientId, 0, -1, function(e, vs) {
      if(vs && vs.length > 0) {
        for(index in vs) {
          var v = vs[index];
          v = JSON.parse(v);
          socket.emit('client news', v);
          usersNews.lrem(data.clientId, 1, v, function(ee, vv){});
        }
      }
    })

    socket.emit('login succes', '登录成功')
  });
  socket.on('USER', function(data){
    console.log('USER', data)
    userName[socket.id] = {
      uuid: data.uuid,
      clientId: data.to
    };
    // users[data.uuid] = socket;
    socket.uuid = data.uuid;
    var socketStr = JSON.stringify(socket);
    users.set(data.uuid, socketStr, function (e, r) {});
    var client = clients[data.to];
    if(client) {
      client.emit('user connect', data);
    }
    clientsNews.lrange(data.uuid, 0, -1, function(e, vs) {
      if(vs && vs.length > 0) {
        for(index in vs) {
          var v = vs[index];
          v = JSON.parse(v);
          socket.emit('client news', v);
          clientsNews.lrem(data.uuid, 1, v, function(ee, vv){});
        }
      }
    })
  });
  socket.on('client news', function(data) {
    console.log('client news', data)
    data = JSON.parse(data)
    // var client = users[data.to];
    users.get(data.to, function(e, v) {
      if(v) {
        var client = JSON.parse(v);
        console.log('client news emit', data);
        client.emit('client news', data);
      } else {
        var tdata = JSON.stringify(data);
        clientsNews.lpush(data.to, tdata, function (e, r) {});
        clientsNews.expireat(key, expireTime);
      }
    })
    // if(client) {
      // console.log('client news emit', data)
      // client.emit('client news', data);
    // }
  })

  socket.on('user news', function(data) {
    console.log('user news', data)
    // var client = clients[data.to];
    var client = clients.get(data.to, function(e, v) {
      if(v) {
        var user = JSON.parse(v);
        console.log('user news emit', data);
        user.emit('user news', data);
      } else {
        var tdata = JSON.stringify(data);
        users.lpush(data.to, tdata, function (e, r) {});
        users.expireat(key, expireTime);
      }
    })
    // if(client) {
    //   console.log('user news emit', data)
    //   client.emit('user news', data);
    // }
  })

  socket.on('USER OFF', function(data) {
    console.log('USER OFF', data)
    var client = clients[data.clientId];
    data.msg = '我下线啦';
    if(client) {
      console.log('USER OFF emit', data)
      client[cocketData.clientId].emit('user disconnect', data);
    }
  })

  //有人下线
  socket.on('disconnect', function() {
    if(socket.uuid) {
      users.del(socket.uuid, function(e,v){});
    }

    if(socket.clientId) {
      clients.del(socket.clientId, function(e,v){});
    }


    //若 users 对象中保存了该用户名
    // var _clientId = clientName[socket.id];
    // console.log("_clientId disconnect", socket.id);
    // var cocketData = userName[socket.id];
    // console.log('我下线啦', cocketData)
    // if (cocketData) {
      //从 users 对象中删除该用户名
      // var data = {};
      // data.msg = '我下线啦';
      // data.uuid = cocketData.uuid;
      // delete users[cocketData.uuid];
      // delete userName[socket.id];
      // if(clients[cocketData.clientId]) {
        // console.log('disconnect', data)
        // clients[cocketData.clientId].emit('user disconnect', data);
      // }
    // }
  });
});

http.listen(port, function(){
});
