module.exports = {
  env: process.env.NODE_ENV,
  eth: {
    web3: {
      url: process.env.ETH_WEB3_URL || 'http://localhost:8545',
      address: process.env.ETH_WEB3_ADDRESS || null
    }
  }
};
