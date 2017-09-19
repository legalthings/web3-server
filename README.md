# Web3 server

## Requirements

- [Node.js](https://nodejs.org/en/download/) >= 6.8.1
- [Npm](https://www.npmjs.com/get-npm/) >= 3.10.8
- [Geth](https://geth.ethereum.org/downloads/) >= 1.6.6

## Installation

Clone the repository

```
git clone git@github.com:legalthings/web3-server.git
```

Install dependencies

```
cd <project_name>
npm install
```

Build and run the project

```
npm start
```

## Ethereum node

The project by default runs [TestRPC](https://github.com/ethereumjs/testrpc) on `http://localhost:8545`.
This is useful for development and testing because its fast.
However, if the server restarts the stored state is reset.
For production you should run your own node via [Geth](https://geth.ethereum.org/downloads/) and then configure the url/port to a different endpoint.

## Configuration

Configuration can be found [here](https://github.com/legalthings/web3-server/tree/master/src/config).
Each environment and hostname can have its own configuration file.
Read more about it [here](https://github.com/lorenwest/node-config/wiki/Configuration-Files#file-load-order).

## Environment variables

Certain pieces of the configuration can be configured through environment variables.

`ETH_WEB3_URL` | The url used to connect Web3 to the ethereum node.
`ETH_WEB3_ADDRESS` | The default wallet address used to make transactions.
