// imports
import {} from 'jest';
import * as request from 'supertest';
import * as express from 'express';
import app from '../../src/server';

import DefaultTest from './default';
import EthTest from './eth';
import ContractTest from './contract';

// vars
const api = request(app);

// run tests
new DefaultTest(api).run();
new EthTest(api).run();
new ContractTest(api).run();
