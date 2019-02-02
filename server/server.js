
var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
const socketio = require('socket.io');
const fileUpload = require('express-fileupload');
const db = require('./app/config/db.config.js');
const routes = require('./app/router/router')
const socketEvents = require('./app/services/socket.js');

class Server {

  constructor() {
    this.port = process.env.PORT || 3300;
    this.host = `localhost`;

    this.app = express();

  }

  appConfig() {
    this.app.use(cors());
    this.app.use(fileUpload());
    // Add headers
    this.app.use(function (req, res, next) {

      // Website you wish to allow to connect
      res.setHeader('Access-Control-Allow-Origin', '*');

      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);

      // Pass to next layer of middleware
      next();
    });
    this.app.use(
      bodyParser.json()
    );
  }

  /* Including app Routes starts*/
  includeRoutes() {
    new routes(this.app).routesConfig();
    new socketEvents(this.socket).socketConfig();
  }
  /* Including app Routes ends*/

  appExecute() {
    var server = this.app.listen(3300, function () {
 
      var host = server.address().address
      var port = server.address().port
     
      console.log("App listening at http://%s:%s", host, port)
    });
    
    //var io = require('socket.io').listen(server);
    this.socket = socketio(server);
    this.appConfig();
    this.includeRoutes();
  }

}

const app = new Server();
app.appExecute();