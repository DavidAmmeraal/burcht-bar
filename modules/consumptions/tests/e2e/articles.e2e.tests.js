'use strict';

describe('Consumptions E2E Tests:', function () {
  describe('Test consumptions page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/consumptions');
      expect(element.all(by.repeater('consumption in consumptions')).count()).toEqual(0);
    });
  });
});
