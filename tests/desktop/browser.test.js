const assert = require('chai').assert;
// const config = require('../../app.config');

// const url = `${config.host}:${config.port}`;

describe('Branches', () => {
  it('Должен показывать заголовок BRANCHES', function () {
    return this.browser
      .url('localhost:3000')
      .getTitle('.title')
      .then((title) => {
        assert.equal(title, 'Branches');
      });
  });

  it('Должен выводиться список веток', function () {
    return this.browser
      .url('localhost:3000')
      .isExisting('.branches-item')
      .then((exists) => {
        assert.ok(exists, true);
      });
  });
});


describe('Форма загрузки', () => {
  it('Форма должна отображаться', function () {
    return this.browser
      .url('localhost:3000')
      .isExisting('.repo-upload-form')
      .then((exists) => {
        assert.ok(exists, true);
      });
  });

  it('При отправке пустого запроса выводится сообщение об ошибке', function () {
    return this.browser
      .url('localhost:3000')
      .click('.repo-upload-form__button')
      .getText('.repo-upload-form__message')
      .then((message) => {
        assert.equal(message, 'Не указан URL репозитория');
      });
  });
});

describe('Files', () => {
  it('Отображается список файлов', function () {
    return this.browser
      .url('http://localhost:3000')
      .click('.branches-item:nth-child(1) .branches-item__files .link')
      .isExisting('.filelist-item')
      .then((exists) => {
        assert.ok(exists, true);
      });
  });

  it('Можно перейти в каталог и вернуться на уровень выше', function () {
    let urlBeforeClick = '';
    return this.browser
      .url('http://localhost:3000')
      .click('.branches-item:nth-child(1) .branches-item__files .link')
      .getUrl()
      .then((currentUrl) => {
        urlBeforeClick = currentUrl;
        return this.browser;
      })
      .click('.filelist-item .link_type_tree')
      .click('.parent')
      .getUrl()
      .then((currentUrl) => {
        assert.equal(currentUrl, urlBeforeClick);
      });
  });

  it('Можно посмотреть содержимое файла', function () {
    return this.browser
      .url('http://localhost:3000')
      .click('.branches-item:nth-child(1) .branches-item__files .link')
      .click('.filelist-item .link_type_file')
      .pause(3000)
      .isExisting('.file-viewer_visible')
      .then((exists) => {
        assert.ok(exists, true);
      });
  });
});

describe('Commits', () => {
  it('Отображается список комитов', function () {
    return this.browser
      .url('http://localhost:3000')
      .click('.branches-item:nth-child(1) .branches-item__commits .link')
      .isExisting('.commits-item')
      .then((exists) => {
        assert.ok(exists, true);
      });
  });

  it('Отображает список файлов коммита', function () {
    let commitHash = '';
    return this.browser
      .url('http://localhost:3000')
      .click('.branches-item:nth-child(1) .branches-item__commits .link')
      .getText('.branches-item__hash')
      .then((hash) => {
        commitHash = hash;
        return this.browser;
      })
      .click('.commits-item .commits-item__link')
      .getText('.title_size_xl')
      .then((title) => {
        assert.ok(title, commitHash);
      });
  });

});

