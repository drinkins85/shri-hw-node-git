const chai = require('chai');

const checkDir = require('../gitApi/checkDir');

const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('checkDir', () => {
  it('Должна возвращать Promise.reject(false) если директории не существует', () => {
    const randomName = `${Math.random() + 1}_${Date.now().toString()}`;
    return expect(checkDir(randomName).then(res => res)).to.eventually.rejectedWith(false);
  });

  it('Должна возвращать Promise.resolve(true) если директория существует', () => {
    const path = process.cwd();
    return expect(checkDir(path).then(res => res)).to.eventually.equal(true);
  });
});
