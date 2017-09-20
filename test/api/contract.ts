import { ApiTest } from '../support/api-test';

export default class extends ApiTest {
  run () {
    describe('GET /eth/contracts', () => {
      test('should return predefined contract list', () => this.testGetContractList());
    });

    describe('GET /eth/contracts/:id', () => {
      test('should return contract information', () => this.testGetContract());
    });
  }

  async testGetContractList () {
    const response = await this.api.get('/eth/contracts');
    expect(response.header['content-type']).toMatch(/json/);
    expect(response.body).toContain('example.sol');
  }

  async testGetContract () {
    const response = await this.api.get('/eth/contracts/example.sol');
    expect(response.header['content-type']).toMatch(/json/);
    expect(response.body).toHaveProperty('abi');
    expect(response.body).toHaveProperty('sol');
    expect(response.body).toHaveProperty('bytecode');
    expect(response.body).toHaveProperty('gas');
  }
}
