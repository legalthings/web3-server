'use strict';

import * as fs from 'fs';

// no typings available
const Web3 = require('web3');
const TestRPC = require('ethereumjs-testrpc');
const solc = require('solc');

interface EthConfig {
  web3: {
    url: string;
    address?: string;
  };
  node?: {
    port: number;
    networkid: number;
    rpcport: number;
  };
}

class Eth {
  public config: EthConfig;
  public web3: any;

  constructor (config: EthConfig, web3?: any) {
    this.config = config;
    this.web3 = web3;
  }

  static async create (config: EthConfig): Promise<Eth> {
    const eth = new this(config, new Web3());

    eth.web3.setProvider(new Web3.providers.HttpProvider(config.web3.url));

    await eth.setDefaultAccount(config.web3.address);

    return eth;
  }

  static startTestRpcServer (port: number): Promise<any> {
    return new Promise((resolve, reject) => {
      TestRPC.server().listen(port, (err: any, res: any) => {
        if (err) {
          return reject(err);
        }

        resolve(res);
      });
    });
  }

  static startGethNodeServer (options: Object): Promise<any> {
    return new Promise((resolve, reject) => {
      console.warn('starting geth node not implemented yet');
      resolve();
    });
  }

  static startNode (config: EthConfig): Promise<any> {
    if (config.node) {
      return Eth.startGethNodeServer(config.node);
    }

    return Eth.startTestRpcServer(8545);
  }

  getSyncing (): Promise<string> {
    return new Promise((resolve, reject) => {
      this.web3.eth.getSyncing((err: any, res: any) => {
        if (err) {
          return reject(err);
        }

        resolve(res);
      });
    });
  }

  getApiVersion (): string {
    return this.web3.version.api;
  }

  getNodeVersion (): Promise<string> {
    return new Promise((resolve, reject) => {
      this.web3.version.getNode((err: any, res: any) => {
        if (err) {
          return reject(err);
        }

        resolve(res);
      });
    });
  }

  getNetworkVersion (name: boolean = true): Promise<string> {
    return new Promise((resolve, reject) => {
      this.web3.version.getNetwork((err: any, res: any) => {
        if (err) {
          return reject(err);
        }

        resolve(name ? this.getNetworkNameById(res) : res);
      });
    });
  }

  getNetworkNameById (id: string): string {
    switch (id) {
      case '1':
        return 'Main';
      case '2':
        return 'Morden';
      case '3':
        return 'Ropsten';
      case '4':
        return 'Rinkeby';
      case '42':
        return 'Kovan';
      default:
        return 'Unknown';
    }
  }

  getAccounts (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts((err: any, res: any) => {
        if (err) {
          return reject(err);
        }

        resolve(res);
      });
    });
  }

  getDefaultAccount () {
    return this.web3.defaultAccount || null;
  }

  setDefaultAccount (address?: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (address) {
        this.web3.defaultAccount = address;
        return resolve(this.web3.defaultAccount);
      }

      const accounts = this.getAccounts().then((res: any) => {
        this.web3.defaultAccount = res[0];
        resolve(this.web3.defaultAccount);
      });
    });
  }
  getBalance (address: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!address) {
        return resolve(0);
      }

      this.web3.eth.getBalance(address, (err: any, res: any) => {
        if (err) {
          return reject(err);
        }

        resolve(this.web3.fromWei(res, 'ether'));
      });
    });
  }

  getPredefinedContractList (): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      fs.readdir('./src/contracts', (err: any, res: any) => {
        if (err) {
          return reject(err);
        }

        resolve(res);
      });
    });
  }

  getPredefinedContract (id: string): Promise<Array<string>|null> {
    return new Promise((resolve, reject) => {
      fs.readFile(`./src/contracts/${id}`, { encoding: 'utf8' }, (err: any, res: any) => {
        if (err) {
          return resolve(null);
        }

        resolve(res);
      });
    });
  }

  isSolidityFilename (filename: string): boolean {
    return (/\.(sol)$/i).test(filename);
  }

  compileSolidityCode (code: string, mode: string = 'compact'): Promise<any> {
    return new Promise((resolve, reject) => {
      const compiled = solc.compile(code, 1);

      if (compiled.errors) {
        return reject(compiled.errors);
      }

      if (mode !== 'compact') {
        return resolve(compiled);
      }

      const compact: any = {};

      for (const contract in compiled.contracts) {
        const name = contract.replace(/:/g, '');
        compact[name] = ({
          abi: JSON.parse(compiled.contracts[contract].interface),
          bytecode: compiled.contracts[contract].bytecode
        });
      }

      resolve(compact);
    });
  }

  async createContractObjects (data: {[name: string]: {abi: string, bytecode: string}}) {
    const result: any = {};

    for (const name in data) {
      result[name] = {
        contract: this.web3.eth.contract(data[name].abi),
        abi: data[name].abi,
        bytecode: data[name].bytecode,
        gas: await this.estimateGas(data[name].bytecode)
      };
    }

    return result;
  }

  estimateGas (bytecode: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.web3.eth.estimateGas({ data: bytecode }, (err: any, res: any) => {
        if (err) {
          return reject(err);
        }

        resolve(res);
      });
    });
  }
}

export { Eth, EthConfig };
