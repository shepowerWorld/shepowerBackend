// const express = require('express');
// require('dotenv').config();
// const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');
// const cors = require("cors");
// const http = require('http');
// const path = require('path');
// const mongoose = require('mongoose');

// const app = express();
// const server = http.createServer(app);
// const io = require('socket.io')(server, {
//   cors: {
//     origin: "http://neelb-1422922409.ap-south-1.elb.amazonaws.com:6002",
//   }
// });

// // Middleware
// app.use(bodyParser.json({ limit: '70mb' }));
// app.use(bodyParser.urlencoded({ limit: '70mb', extended: false, parameterLimit: 1000000 }));
// app.use(cors());

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://neelb-1422922409.ap-south-1.elb.amazonaws.com:6002");
//   res.header("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS,PATCH,POST");
//   res.header("Access-Control-Allow-Headers", "Content-Type");

//   if (req.headers['upgrade'] && req.headers['upgrade'].toLowerCase() === 'websocket') {
//     res.header('Connection', 'Upgrade');
//     res.header('Upgrade', 'websocket');
//   }
//   next();
// });

// // Static files
// const staticPath = path.join(__dirname, '/public');
// app.use(express.static(staticPath));

// // Routes
// app.get('/', function(req, res) {  
//   res.sendFile(__dirname + "/public/index.html");
// });

// const router = require('./app/routers/index');
// app.use('/', router);

// // WebSocket setup
// let usersJoin = {};
// let UserBlock = {};

// io.on('connection', (socket) => {
//   console.log('Socket connected:', socket.id);

//   socket.on('userLoggedIn', ({ userId }) => {
//     console.log(`User logged in: ${userId}`);
//     usersJoin[socket.id] = userId;
//     io.emit('userStatusChanged', { userId, status: 'online' });
//   });

//   socket.on('userLogin', (data) => {
//     console.log('User userLogin', data);
//     socket.join(data.userid);
//     if (!UserBlock[socket.id]) {
//       UserBlock[socket.id] = data.userid;
//     }
//     console.log("block", UserBlock);
//   });

//   socket.on('joinRoom', (room) => {
//     socket.join(room);
//     if (!usersJoin[socket.id]) {
//       usersJoin[socket.id] = room;
//     }
//     io.to(room).emit("online message", [socket.id], { online: true });
//   });

//   socket.on('online message', (room) => {
//     io.to(room).emit('online message1', { online: true, time: new Date().toLocaleTimeString() });
//   });

//   socket.on('firstDeviceLogout', (data) => {
//     console.log('firstDeviceLogout', data);
//     io.to(data.id).emit('firstDeviceLogout1', { data });
//   });

//   socket.on('typing', (data) => {
//     console.log('typing...', data[0].room, data[0].socket);
//     io.to(data[0].room).emit('typing1', data);
//   });

//   socket.on('stopTyping', (data) => {
//     console.log('stoptyping...', data[0].room, data[0].socket);
//     io.to(data[0].room).emit('stopTyping1', data);
//   });

//   socket.on('message', (data) => {
//     console.log('message', data);
//     io.to(data.room_id).emit('messageSend', data);
//   });

//   socket.on('getmessage', (data) => {
//     console.log('getmessage', data);
//     io.to(data.room_id).emit('getmessage', { ...data, time: new Date().toLocaleTimeString() });
//   });

//   socket.on('user attachment', (data) => {
//     console.log('user attachment', data);
//     io.to(data.room_id).emit('user attachment', { ...data, time: new Date().toLocaleTimeString() });
//   });

//   socket.on('location', (data) => {
//     console.log('location', data);
//     io.to(data.room_id).emit('location', { ...data, time: new Date().toLocaleTimeString() });
//   });

//   socket.on('AdminBlock', (data) => {
//     console.log('Admin Block', data);
//     io.to(data._id).emit('userBlockStatus', { data });
//   });

//   socket.on('disconnect', () => {
//     if (usersJoin.hasOwnProperty(socket.id)) {
//       const userId = usersJoin[socket.id];
//       const time = new Date().toLocaleTimeString('en-US', {
//         hour: 'numeric',
//         minute: 'numeric',
//         hour12: true
//       });
//       delete usersJoin[socket.id];
//       io.emit('userStatusChanged', { userId, time, status: 'offline' });
//       console.log(`User logged out: ${userId}`);
//     }
//   });
// });

// // Database setup
// const dbConfig = require('./config/database.config.js');
// mongoose.Promise = global.Promise;
// mongoose.connect(dbConfig.url, {
//   useNewUrlParser: true
// }).then(() => {
//   console.log("Database Connected Successfully!!");
// }).catch(err => {
//   console.log('Could not connect to the database', err);
//   process.exit();
// });

// server.listen(6002, () => {
//   console.log("Server is listening on port 6002");
// });


const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require("cors");
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*", // Make sure this matches your domain
  }
});

// Middleware
app.use(bodyParser.json({ limit: '70mb' }));
app.use(bodyParser.urlencoded({ limit: '70mb', extended: false, parameterLimit: 1000000 }));
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,DELETE,OPTIONS,PATCH,POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.headers['upgrade'] && req.headers['upgrade'].toLowerCase() === 'websocket') {
    res.header('Connection', 'Upgrade');
    res.header('Upgrade', 'websocket');
  }
  next();
});

// Static files
const staticPath = path.join(__dirname, '/public');
app.use(express.static(staticPath));

app.get('/test', function(req, res) {  
  res.send("working123");
});


// Routes
app.get('/', function(req, res) {  
  res.sendFile(__dirname + "/public/index.html");
});

const router = require('./app/routers/index');
app.use('/', router);

// WebSocket setup
let usersJoin = {};
let UserBlock = {};

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('userLoggedIn', ({ userId }) => {
    console.log(`User logged in: ${userId}`);
    usersJoin[socket.id] = userId;
    io.emit('userStatusChanged', { userId, status: 'online' });
  });

  socket.on('userLogin', (data) => {
    console.log('User userLogin', data);
    socket.join(data.userid);
    if (!UserBlock[socket.id]) {
      UserBlock[socket.id] = data.userid;
    }
    console.log("block", UserBlock);
  });

  socket.on('joinRoom', (room) => {
    socket.join(room);
    if (!usersJoin[socket.id]) {
      usersJoin[socket.id] = room;
    }
    io.to(room).emit("online message", [socket.id], { online: true });
  });

  socket.on('online message', (room) => {
    io.to(room).emit('online message1', { online: true, time: new Date().toLocaleTimeString() });
  });

  socket.on('firstDeviceLogout', (data) => {
    console.log('firstDeviceLogout', data);
    io.to(data.id).emit('firstDeviceLogout1', { data });
  });

  socket.on('typing', (data) => {
    console.log('typing...', data[0].room, data[0].socket);
    io.to(data[0].room).emit('typing1', data);
  });

  socket.on('stopTyping', (data) => {
    console.log('stoptyping...', data[0].room, data[0].socket);
    io.to(data[0].room).emit('stopTyping1', data);
  });

  socket.on('message', (data) => {
    console.log('message', data);
    io.to(data.room_id).emit('messageSend', data);
  });

  socket.on('getmessage', (data) => {
    console.log('getmessage', data);
    io.to(data.room_id).emit('getmessage', { ...data, time: new Date().toLocaleTimeString() });
  });

  socket.on('user attachment', (data) => {
    console.log('user attachment', data);
    io.to(data.room_id).emit('user attachment', { ...data, time: new Date().toLocaleTimeString() });
  });

  socket.on('location', (data) => {
    console.log('location', data);
    io.to(data.room_id).emit('location', { ...data, time: new Date().toLocaleTimeString() });
  });

  socket.on('AdminBlock', (data) => {
    console.log('Admin Block', data);
    io.to(data._id).emit('userBlockStatus', { data });
  });

  socket.on('disconnect', () => {
    if (usersJoin.hasOwnProperty(socket.id)) {
      const userId = usersJoin[socket.id];
      const time = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
      delete usersJoin[socket.id];
      io.emit('userStatusChanged', { userId, time, status: 'offline' });
      console.log(`User logged out: ${userId}`);
    }
  });
});

// Database setup
const dbConfig = require('./config/database.config.js');
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
  useNewUrlParser: true
}).then(() => {
  console.log("Database Connected Successfully!!");
}).catch(err => {
  console.log('Could not connect to the database', err);
  process.exit();
});

server.listen(6002, () => {
  console.log("Server is listening on port 6002");
});
