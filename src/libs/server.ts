// modules
import * as express from 'express';
import * as config from 'config';

// libs
import { Eth } from './eth';

class Server {
  config: config.IConfig;
  app: express.Express;
  eth: Eth;

  constructor (config: config.IConfig, app: express.Express, eth: Eth) {
    this.config = config;
    this.app = app;
    this.eth = eth;
  }

  start (): Promise<any> {
    return new Promise(async (resolve: any, reject: any) => {
      await this.eth.startNode();
      this.app.listen(config.get('port'), () => resolve());
    });
  }
}

export { Server };
