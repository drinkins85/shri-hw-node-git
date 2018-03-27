const GitApi = require('../gitApi/GitApi');
const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');
const moment = require('moment');

const expect = chai.expect;
chai.use(chaiAsPromised);

class GitApiTest extends GitApi {
  executeGitCommand(command, options) {
    const gitCommand = command.join(' ');
    return new Promise((resolve, reject) => {
      switch (gitCommand) {
        case 'branch --list': resolve('* master');
          break;
        case 'cat-file -p master^{tree}': resolve('100644 blob 12345678910\tfilename');
          break;
        case 'log master --pretty=format:%at|%H|%s': {
          resolve('1521813838|6af81a1a790e0786b8cbf6f31bf4cced113b2d7a|Общая структура класса GitApi');
          break;
        }
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

  describe('getBranchFiles', () => {
    it('Должна возвращать массив ', () => {
      return expect(gitApiTest.getBranchFiles('master').then(res => res)).to.eventually.be.a('Array');
    });
    it('Правильно возвращает тип файла', () => {
      const filelist = gitApiTest.getBranchFiles('master');
      return expect(filelist.then(res => res[0].type)).to.eventually.equal('blob');
    });
    it('Правильно возвращает хэш файла', () => {
      const filelist = gitApiTest.getBranchFiles('master');
      return expect(filelist.then(res => res[0].hash)).to.eventually.equal('12345678910');
    });
    it('Правильно возвращает имя файла', () => {
      const filelist = gitApiTest.getBranchFiles('master');
      return expect(filelist.then(res => res[0].filename)).to.eventually.equal('filename');
    });
  });

  describe('getBranchCommits', () => {
    it('Должна возвращать массив ', () => {
      return expect(gitApiTest.getBranchCommits('master').then(res => res)).to.eventually.be.a('Array');
    });
    it('Правильно возвращает дату коммита', () => {
      const filelist = gitApiTest.getBranchCommits('master');
      return expect(filelist.then(res => res[0].date)).to.eventually.equal(moment.unix(1521813838).format('D.MM.YYYY H:mm'));
    });
    it('Правильно возвращает хэш коммита', () => {
      const filelist = gitApiTest.getBranchCommits('master');
      return expect(filelist.then(res => res[0].hash)).to.eventually.equal('6af81a1a790e0786b8cbf6f31bf4cced113b2d7a');
    });
    it('Правильно возвращает описание коммита', () => {
      const filelist = gitApiTest.getBranchCommits('master');
      return expect(filelist.then(res => res[0].subject)).to.eventually.equal('Общая структура класса GitApi');
    });
  });
});
