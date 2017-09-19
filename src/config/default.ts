module.exports = {
  env: process.env.NODE_ENV,
  eth: {
    web3: {
      url: 'http://localhost:8545',
      address: null
    },
    // this is not implemented yet
    /*node: {
      init: 'rinkeby.json',
      networkid: 4,
      port: 30303,
      rpcport: 8545,
      syncmode: 'light',
      cache: 1024
    }*/
  }
};
