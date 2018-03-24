const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const bodyParser = require('body-parser');
const checkDir = require('./gitApi/checkDir');

const app = express();

const port = process.env.PORT || 5002;
const host = '0.0.0.0';

const path = '_repo';
const GitApi = require('./gitApi/GitApi');

const gitApi = new GitApi(path);


hbs.registerHelper('showFS', (files) => {
  let list = '';
  files.forEach((item) => {
    if (item.type === 'tree') {
      list += `<li>[<a href="${item.hash}/" class="tree">${item.filename}</a>]</li>`;
    } else {
      list += `<li><a href="file/${item.hash}" class="file">${item.filename}</a> 
               <button data-hash="${item.hash}" class="fileBtn">[]</button></li>`;
    }
  });
  return new hbs.SafeString(`<ul>${list}</ul>`);
});

app.use(bodyParser.text());
app.use(express.static(`${__dirname}/public`));
hbs.registerPartials(`${__dirname}/views/blocks`);
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  checkDir(path)
    .then(() => {
      gitApi.getBranchList()
        .then((branchList) => {
          res.render('home.hbs', {
            pageTitle: 'Main page',
            branchList,
            repoExist: true,
          });
        })
        .catch(err => console.error(err));
    })
    .catch((err) => {
      res.render('home.hbs', {
        pageTitle: 'Main page',
        repoExist: false,
      });
    });
});

app.get('/:branch/', (req, res) => {
  const branchName = req.params.branch;
  res.render('branch.hbs', {
    pageTitle: branchName,
  });
});

app.get('/:branch/files/*', (req, res) => {
  const branchName = req.params.branch;
  const levels = req.params[0].split('/').filter(item => item !== '');
  if (levels.length === 0) {
    gitApi.getBranchFiles(branchName)
      .then((fileList) => {
        res.render('files.hbs', {
          pageTitle: branchName,
          fileList,
          parentLevel: false,
        });
      })
      .catch(err => console.error(err));
  } else {
    const currentTree = levels[levels.length - 1];
    let parentLevel;
    if (levels.length > 1) {
      parentLevel = `/${branchName}/files/${levels.slice(0, levels.length - 1).join('/')}`;
    } else {
      parentLevel = `/${branchName}/files/`;
    }
    gitApi.getTreeFiles(currentTree)
      .then((fileList) => {
        res.render('files.hbs', {
          pageTitle: branchName,
          fileList,
          parentLevel,
        });
      })
      .catch(err => console.error(err));
  }
});

app.get('/:branch/files', (req, res) => {
  res.redirect(`${req.url}/`);
});


app.get('/:branch/commits/', (req, res) => {
  const branchName = req.params.branch;
  gitApi.getBranchCommits(branchName)
    .then((commitList) => {
      res.render('commits.hbs', {
        pageTitle: branchName,
        commitList,
      });
    })
    .catch(err => console.error(err));
});

app.get('/:branch/commits/:hash/*', (req, res) => {
  const branchName = req.params.branch;
  const hash = req.params.hash;
  const levels = req.params[0].split('/').filter(item => item !== '');
  if (levels.length === 0) {
    gitApi.getCommitFiles(hash)
      .then((fileList) => {
        res.render('files.hbs', {
          pageTitle: hash,
          fileList,
          parentLevel: false,
        });
      })
      .catch(err => console.error(err));
  } else {
    const currentTree = levels[levels.length - 1];
    let parentLevel;
    if (levels.length > 1) {
      parentLevel = `/${branchName}/commits/${hash}/${levels.slice(0, levels.length - 1).join('/')}`;
    } else {
      parentLevel = `/${branchName}/commits/${hash}/`;
    }
    gitApi.getTreeFiles(currentTree)
      .then((fileList) => {
        res.render('files.hbs', {
          pageTitle: branchName,
          fileList,
          parentLevel,
        });
      })
      .catch(err => console.error(err));
  }
});

app.get('/getfilecontent/:hash', (req, res) => {
  const fileHash = req.params.hash;
  gitApi.showFile(fileHash)
    .then(fileContent => res.send(fileContent));
});


app.post('/git-clone', (req, res) => {
  const repoUrl = req.body;
  gitApi.cloneRepo(repoUrl)
    .then(() => res.send('OK'))
    .catch(err => res.send('FAIL ', err));
});

app.listen(port, host);

console.log(`App listen on port ${port}`);

