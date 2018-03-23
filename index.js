const express = require('express');

const app = express();

const port = process.env.PORT || 5000;
const host = '0.0.0.0';

const path = 'repo';
const GitApi = require('./gitApi/GitApi');

const gitApi = new GitApi(path);

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  gitApi.cloneRepo('https://github.com/drinkins85/node-git.git')
    .then(() => {
      gitApi.getBranchList().then((branchList) => {
        console.log(branchList);
        res.send(`Hello, World ${branchList}`);
      });
    });
});

app.listen(port, host);

console.log(`App listen on port ${port}`);

