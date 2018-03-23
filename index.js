const express = require('express');
const hbs = require('hbs');

const app = express();

const port = process.env.PORT || 5002;
const host = '0.0.0.0';

const path = '_repo';
const GitApi = require('./gitApi/GitApi');

const gitApi = new GitApi(path);


app.use(express.static(`${__dirname}/public`));
hbs.registerPartials(`${__dirname}/views/blocks`);
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  gitApi.getBranchList()
    .then((branchList) => {
      res.render('home.hbs', {
        pageTitle: 'Main page',
        branchList,
      });
    })
    .catch((err) => {
      console.error();
      res.rend('Ошибка');
    });
});


app.get('/:branch', (req, res) => {
  const branchName = req.params.branch;
  gitApi.getBranchFiles(branchName)
    .then((fileList) => {
      res.render('branch.hbs', {
        pageTitle: branchName,
        fileList,
      });
    })
    .catch((err) => {
      console.error(err);
    });
});


app.get('/git-clone', (req, res) => {
  gitApi.cloneRepo('https://github.com/drinkins85/Peppermint.git')
    .then(() => res.send('OK'))
    .catch(err => res.send('FAIL ', err));
});

app.get('/branchlist', (req, res) => {
  gitApi.getBranchList().then((branchList) => {
    res.send(`Hello, World ${JSON.stringify(branchList)}`);
  });
});


app.listen(port, host);

console.log(`App listen on port ${port}`);

