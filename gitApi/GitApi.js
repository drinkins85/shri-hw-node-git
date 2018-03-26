const moment = require('moment');
const isGitUrl = require('is-git-url');
const removeDir = require('./removeDir');
const { spawn } = require('child_process');

class GitApi {
  constructor(path, dateFormat) {
    this.path = path;
    this.dateFormat = dateFormat;
  }

  getBranchList() {
    const command = ['branch', '--list'];
    return this.executeGitCommand(command, { cwd: this.path })
      .then((res) => {
        const branches = res.split(/\n\s*/).filter(brName => brName !== '');
        return branches.map((branchName) => {
          if (branchName[0] === '*') {
            branchName = branchName.slice(2);
          }
          branchName = branchName.replace(/(^\s+|\s+$)/g, '');
          return branchName;
        });
      })
      .catch(err => console.error(err));
  }

  getBranchFiles(branchName) {
    const command = ['cat-file', '-p', `${branchName}^{tree}`];
    return this.executeGitCommand(command, { cwd: this.path })
      .then(res => this.filelistFormatter(res))
      .catch((err) => {
        console.error(err);
        return [];
      });
  }

  getBranchCommits(branchName) {
    const command = ['log', branchName, '--pretty=format:%at|%H|%s'];
    return this.executeGitCommand(command, { cwd: this.path })
      .then((res) => {
        const commitsRow = res.split('\n');
        return commitsRow.map((row) => {
          const commit = {};
          const commitRowItems = row.split('|');
          commit.date = moment.unix(parseInt(commitRowItems[0], 10)).format(this.dateFormat);
          commit.hash = commitRowItems[1];
          commit.subject = commitRowItems[2];
          return commit;
        });
      })
      .catch(err => console.error(err));
  }

  getCommitFiles(commitHash) {
    const command = ['cat-file', '-p', commitHash];
    return this.executeGitCommand(command, { cwd: this.path })
      .then((res) => {
        const commitRows = res.split(/\n+/);
        const commitTree = commitRows[0].split(' ')[1];
        return this.getTreeFiles(commitTree);
      })
      .catch(err => console.error(err));
  }

  getTreeFiles(treeHash) {
    const treeCommand = ['cat-file', '-p', treeHash];
    return this.executeGitCommand(treeCommand, { cwd: this.path })
      .then(res => this.filelistFormatter(res))
      .catch(err => console.error(err));
  }

  showFile(fileHash) {
    const command = ['show', fileHash];
    return this.executeGitCommand(command, { cwd: this.path });
  }

  cloneRepo(repoUrl) {
    if (!isGitUrl(repoUrl)) {
      return Promise.reject();
    }
    return removeDir(this.path)
      .then(() => {
        const command = ['clone', '--bare', repoUrl, this.path];
        return this.executeGitCommand(command)
          .then(() => console.log('Репозиторий склонирован'))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  executeGitCommand(command, options) {
    return new Promise((resolve, reject) => {
      const git = spawn('git', command, options);
      const out = [];
      git.stdout.on('data', (data) => {
        out.push(data);
      });
      git.stderr.on('data', (data) => {
        out.push(data);
      });
      git.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`${out} child process exited with code ${code}`));
        }
        return resolve(out.toString());
      });
    });
  }

  filelistFormatter(stdout) {
    const branchTree = stdout.split(/\n\s*/).filter(brName => brName !== '');
    return branchTree.map((item) => {
      const separated = item.split('\t');
      const separatedMore = separated[0].split(' ');
      const itemObj = {};
      itemObj.type = separatedMore[1];
      itemObj.hash = separatedMore[2];
      itemObj.filename = separated[1];
      return itemObj;
    }).sort((l, r) => l.type < r.type);
  }
}

module.exports = GitApi;
