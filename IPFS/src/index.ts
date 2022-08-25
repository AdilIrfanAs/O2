Promise = require('bluebird');
import { port } from './config/vars';
import { connect } from './config/mongoose';
import app from './config/express';
import http from 'http';
connect();
http.createServer(app).listen(port);
module.exports = app;