const GitApi = require('../gitApi/GitApi');
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');

const expect = chai.expect;
chai.use(chaiAsPromised);

class GitApiTest extends GitApi {
  executeGitCommand(command, options) {
    const gitCommand = command.join(' ');
    return new Promise((resolve, reject) => {
      switch (gitCommand) {
        case 'branch --list': resolve('* master');
      }
    });
  }
}
const gitApiTest = new GitApiTest('test', 'D.MM.YYYY H:mm');


describe('GitApi', () => {
  describe('filelistFormatter', () => {
    it('Должна возвращать массив', () => {
      const filelist = gitApiTest.filelistFormatter('100644 blob 12345678910\tfilename');
      return expect(filelist).to.be.a('Array');
    });

    it('Правильно парсит тип файла', () => {
      const filelist = gitApiTest.filelistFormatter('100644 blob 12345678910\tfilename');
      return expect(filelist[0].type).to.equal('blob');
    });

    it('Правильно парсит хэш файла', () => {
      const filelist = gitApiTest.filelistFormatter('100644 blob 12345678910\tfilename');
      return expect(filelist[0].hash).to.equal('12345678910');
    });

    it('Правильно парсит имя файла', () => {
      const filelist = gitApiTest.filelistFormatter('100644 blob 12345678910\tfilename');
      return expect(filelist[0].filename).to.equal('filename');
    });
  });

  describe('getBranchList', () => {
    it('Должна возвращать массив ', () => {
      return expect(gitApiTest.getBranchList().then(res => res)).to.eventually.be.a('Array');
    });
    it('Элементы массива содержат названия веток', () => {
      return expect(gitApiTest.getBranchList().then(res => res[0])).to.eventually.equal('master');
    });
  });


});
