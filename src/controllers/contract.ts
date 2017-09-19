'use strict';

import { Response, Request } from 'express';
import * as config from 'config';
import { Eth, EthConfig } from '../libs/eth';

class ContractController {
  public settings: EthConfig;

  constructor (settings?: EthConfig) {
    this.settings = settings || config.get('eth');
  }

  /**
   * GET /eth/contracts
   * List available predefined contracts
   */
  list = async (req: Request, res: Response) => {
    const eth = await Eth.create(this.settings);
    const available = await eth.getPredefinedContractList();

    res.json(available);
  }

  /**
   * GET /eth/contracts/:id
   * Get predefined contract
   */
  get = async (req: Request, res: Response) => {
    const eth = await Eth.create(this.settings);
    const contract = await eth.getPredefinedContract(req.params.id);

    if (!contract) {
      res.status(404).send('Not found');
    }

    res.type('text/plain').send(contract);
  }

  /**
   * POST /eth/contracts
   * Create transaction based on predefined contract
   */
  create = async (req: Request, res: Response) => {
    const eth = await Eth.create(this.settings);

    if (!req.body) {
      return res.status(400).send('Invalid payload');
    }

    if (!req.body.contract) {
      return res.status(400).send('Contract not given');
    }

    const contract = eth.isSolidityFilename(req.body.contract) ?
      await eth.getPredefinedContract(req.body.contract) :
      req.body.contract;

    if (!contract) {
      res.status(404).send('Not found');
    }

    const compiled = await eth.compileSolidityCode(contract).catch((err) => {
      return res.status(400).send('Contract contains errors:\n\n' + err);
    });

    const create = req.body.create || null;

    for (const contract in compiled) {
      if (create && !create[contract]) {
        continue;
      }
    }

    const contracts = await eth.createContractObjects(compiled);

    // @todo: create transactions

    res.end();
  }
}

const contractController = new ContractController();

export { ContractController, contractController };
