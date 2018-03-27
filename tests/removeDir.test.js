const removeDir = require('../gitApi/removeDir');

const chai = require('chai');

const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('removeDir', () => {
  it('Должна возвращать имя удаленной директории', () => {
    const randomName = `${Math.random() + 1}_${Date.now().toString()}`;
    return expect(removeDir(randomName)).to.eventually.equal(randomName);
  });
});
