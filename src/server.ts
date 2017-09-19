// env vars
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.NODE_CONFIG_DIR = process.cwd() + '/dist/config';

// modules
import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
import * as path from 'path';
import * as config from 'config';

import { Eth, EthConfig } from './libs/eth';
import expressValidator = require('express-validator');

// controllers
import { defaultController } from './controllers/default';
import { ethController } from './controllers/eth';
import { contractController } from './controllers/contract';

// express
const app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// routes
app.get('/', defaultController.info);
app.get('/eth', ethController.info);
app.get('/eth/contracts', contractController.list);
app.get('/eth/contracts/:id', contractController.get);
app.post('/eth/contracts', contractController.create);

// error handler
app.use(errorHandler());

// start server
app.listen(app.get('port'), () => {
  console.log(('App is running at http://localhost:%d in %s mode'), app.get('port'), app.get('env'));
  console.log('Press CTRL-C to stop\n');
});

// start ethereum node
const ethConfig = config.get('eth') as EthConfig;

Eth.startNode(ethConfig).then(() => {
  console.log(('Eth node is running at %s'), ethConfig.web3.url);
}).catch((err) => {
  console.error(`Failed to start eth node: ${err}`);
});

export default app;
