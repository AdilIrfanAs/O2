import express from 'express';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import cors from 'cors';
import path from 'path';
import rateLimit from "express-rate-limit";
import bearerToken from 'express-bearer-token';
import morgan from 'morgan';
import compression from 'compression';
import frontRoutes from '../api/routes/v1/front/index';
import error from '../api/middlewares/error';
import CryptoJS from "crypto-js";

/**
* Express instance
* @public
*/
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bearerToken());

app.use(methodOverride());
const apiRequestLimiterAll = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 90000
});

// app.use(function (req, res, next) {
//   console.log(req.headers)
//   if (req.method == 'POST' || req.method == 'PUT' || req.method == 'DELETE') {

//     console.log("==== req.headers.authorization ====")
//     console.log(req.headers.authorization)

//     if (!req.headers.authorization) {
//       return res.status(403).json({ error: 'No credentials sent!' });
//     } else {
//       // Decrypt
//       var bytes = CryptoJS.AES.decrypt(req.headers.authorization, `${process.env.CLIENT_ENCRYPTION_KEY}`);
//       var CLIENT_SECRET = bytes.toString(CryptoJS.enc.Utf8);

//       console.log("==== CLIENT_SECRET ====")
//       console.log(CLIENT_SECRET);
//       if (!(CLIENT_SECRET == `${process.env.CLIENT_SECRET_KEY}`)) {
//         return res.status(402).json({ error: 'Invalid token!' });
//       }
//     }
//   }
//   next();
// });

app.use("/v1/", apiRequestLimiterAll);

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// compress all responses
app.use(compression());

// mount admin api v1 routes
app.use('/v1/front', frontRoutes);

app.use('/uploads/', express.static('uploads'))

// Admin Site Build Path
app.use('/admin/', express.static(path.join(__dirname, '../../admin')))
app.get('/admin/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../../admin', 'index.html'));
});

// Front Site Build Path
app.use('/', express.static(path.join(__dirname, '../../client')))
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../../client', 'index.html'));
});

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

export default app;