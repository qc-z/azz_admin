var app = require('express')();
var express = require('express');
var path = require('path')
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 4000;

var multer  = require('multer');

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
        res.sendStatus(200);
    } else {
        next();
    }
});

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/user', upload.single('file'), function (req,res) {
  // console.log(req.body);
  // console.log(req.file);
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
  // console.log(req);
  // console.log(req.body);
  // console.log(req.file);
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

var max = 4;
var min = 0;
var aa = parseInt(Math.random()*(max-min+1)+min,10);

var users = {};
var clients = {};

var userDevice = {};
var devices = {};

var userName = {};
var clientName = {};

var userRecord = {};
var clientRecord = {};

var userLogin = {};

function removeByValue(arr, val) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}

io.on('connection', function(socket){
  console.log('connection', socket.id)
  socket.emit('connect succes', '连接成功')
  socket.on('AR', function(data){
    console.log('AR 登录。。', data)
    try {  
      data = JSON.parse(data);
    }
    catch(err) {
      data = data
    }
    socket.clientId = data.clientId;
    socket.deviceId = data.deviceId;
    socket.role = 'client';
    clients[data.deviceId] = socket;

    if(clientRecord[data.deviceId] && clientRecord[data.deviceId].length > -1) {
      if(userLogin[data.deviceId] && userLogin[data.deviceId].length > -1) {
        for (var i = 0; i < userLogin[data.deviceId].length; i++) {
          console.log('发送登录信息给AR', userLogin[data.deviceId][i], data.deviceId);
          socket.emit('user connect', userLogin[data.deviceId][i]);
        }
      }
      var clientOldNews = clientRecord[data.deviceId];
      for (var i = 0; i < clientOldNews.length; i++) {
        console.log('发送历史信息给AR', clientOldNews[i], data.deviceId);
        socket.emit('user news', clientOldNews[i]);
      }
      console.log('删除历史信息给AR的');
      delete userLogin[data.deviceId];
      delete clientRecord[data.deviceId];
    }

    if (!devices[data.clientId]) {
      devices[data.clientId] = [];
    }

    if(devices[data.clientId].indexOf(data.deviceId) === -1) {
      devices[data.clientId].push(data.deviceId);
    }

    socket.emit('login succes', '登录成功')
  });
  socket.on('USER', function(data){
    console.log('USER 登录。。', data)
    socket.uuid = data.uuid;
    socket.to = data.to;
    socket.role = 'user';
    users[data.uuid] = socket;

    if(userRecord[data.uuid] && userRecord[data.uuid].length > -1) {
      var userOldNews = userRecord[data.uuid];
      for (var i = 0; i < userOldNews.length; i++) {
        console.log('发送历史信息给 user', userOldNews[i], data.uuid)
        socket.emit('client news', userOldNews[i]);
      }
      delete userRecord[data.uuid];
    }

    if(devices[data.to] && devices[data.to].length > 0) {
      var devicesLen = devices[data.to].length - 1;
      var aa = parseInt(Math.random()*(devicesLen-min+1)+min,10);
      deviceId = devices[data.to][aa];

      console.log('用户登录时候的映射表', userDevice);
      var _deviceId = userDevice[data.uuid];
      if(_deviceId) {
        console.log('deviceId 已经存在', _deviceId)
        var _client = clients[_deviceId];
        if(_client) {
          _client.emit('user connect', data);
        }
      } else {
        userDevice[data.uuid] = deviceId;
        client = clients[deviceId];
        if(client) {
          console.log('用户登录消息发给 AR', data)
          client.emit('user connect', data);
        } else {
          console.log('用户登录时，找不到在线的 device', data)
        }
      }
    }
  });
  socket.on('client news', function(data) {
    console.log('美容院准备发消息给用户', data)
    data = JSON.parse(data)
    var user = users[data.to];
    if(user) {
      console.log('美容院发消息给用户,,发送完毕', data)
      // socket.emit('user receive', data)
      user.emit('client news', data);
    } else {
      console.log('美容院发消息给用户前， 用户已经下线了')
      // socket.emit('user disreceive', data)
      if(userRecord[data.to] && userRecord[data.to].length > -1) {
        userRecord[data.to].push(data);
      } else {
        userRecord[data.to] = [data];
      }
    }
  })

  socket.on('user exist', function(data) {
    data = JSON.parse(data);
    var user = users[data.uuid];
    if(user) {
      data.exist = true;
      socket.emit('user exist', data);
    } else {
      data.exist = false;
      socket.emit('user exist', data);
      console.log('去掉映射表', userDevice);
      delete userDevice[data.uuid];
    }
  })

  socket.on('user news', function(data) {
    console.log('用户准备发消息给美容院', data)
    var device = userDevice[data.uuid]
    var client = clients[device];
    if(client) {
      console.log('用户发消息给美容院,发送完毕', data, client.deviceId)
      client.emit('user news', data);
    } else if(device){
      if(clientRecord[device] && clientRecord[device].length > -1) {
        console.log('保存 发送给AR的离线消息');
        clientRecord[device].push(data);
      } else {
        console.log('保存 发送给AR的离线消息');
        clientRecord[device] = [data];
        if(userLogin[device] && userLogin[device].length > -1) {
          userLogin[device].push(data);
          console.log('保存 发送给AR的离线消息-登录消息');
        } else {
          console.log('保存 发送给AR的离线消息-登录消息');
          userLogin[device] = [data];
        }
      }
    } else {
      console.log('deviceId 不存在， 重新找个deviceId')
      if(devices[data.to] && devices[data.to].length > 0) {
        var devicesLen = devices[data.to].length - 1;
        var aa = parseInt(Math.random()*(devicesLen-min+1)+min,10);
        deviceId = devices[data.to][aa];

        userDevice[data.uuid] = deviceId;

        client = clients[deviceId];
        if(client) {
          client.emit('user connect', data);
          console.log('用户新device发消息给美容院,发送完毕', data, client.deviceId)
          client.emit('user news', data, client.deviceId);
        } else {
          console.log('没有找到在线的 deviceId', data)
        }
      }

    }
  })

  socket.on('USER OFF', function(data) {
    console.log('USER OFF 用户手动下线', data)
    var device = userDevice[data.uuid]
    var client = clients[device];
    data.msg = '我下线啦';
    if(client) {
      console.log('USER OFF emit 用户手动下线的消息发给美容院了', data)
      client.emit('user disconnect', data);
    } else {
      console.log('USER OFF emit 用户手动下线的消息发给美容院的时候 美容院不在线')
    }
    delete users[data.uuid];
    // delete userDevice[data.uuid];
  })

  //有人下线
  socket.on('disconnect', function() {
    //若 users 对象中保存了该用户名
    // var _clientId = clientName[socket.id];
    console.log("有人下线", socket.uuid, socket.deviceId, socket.id, socket.role);

    if(socket.role === 'user') {
      delete users[socket.uuid];
      console.log(userDevice)
    }
    if(socket.role === 'client') {
      var clientId = socket.clientId;
      var deviceId = socket.deviceId;

      if(devices[clientId] && devices[clientId].indexOf(deviceId) > -1) {
        removeByValue(devices[clientId], deviceId)
        delete clients[deviceId]
      }
    }

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
