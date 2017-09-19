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
This is useful for development and testing. If the server restarts the stored state is reset.
For production you should run your own node via [Geth](https://geth.ethereum.org/downloads/) and then configure the url/port to a different endpoint.
