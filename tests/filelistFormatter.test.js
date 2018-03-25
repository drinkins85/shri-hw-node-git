const chai = require('chai');
const expect = chai.expect;
const filelistFormatter = require('../gitApi/filelistFormatter');


describe('filelistFormatter', () => {
  it('Должна возвращать массив', () => {
    const filelist = filelistFormatter('100644 blob 12345678910\tfilename');
    return expect(filelist).to.be.a('Array');
  });

  it('Правильно парсит тип файла', () => {
    const filelist = filelistFormatter('100644 blob 12345678910\tfilename');
    return expect(filelist[0].type).to.equal('blob');
  });

  it('Правильно парсит хэш файла', () => {
    const filelist = filelistFormatter('100644 blob 12345678910\tfilename');
    return expect(filelist[0].hash).to.equal('12345678910');
  });

  it('Правильно парсит имя файла', () => {
    const filelist = filelistFormatter('100644 blob 12345678910\tfilename');
    return expect(filelist[0].filename).to.equal('filename');
  });
});
