const moment = require('moment');
const executeGitCommand = require('./executeGitCommand');
const filelistFormatter = require('./filelistFormatter');
const isGitUrl = require('is-git-url');
const removeDir = require('./removeDir');

class GitApi {
  constructor(path, dateFormat) {
    this.path = path;
    this.dateFormat = dateFormat;
  }

  getBranchList() {
    const command = ['branch', '--list'];
    return executeGitCommand(command, { cwd: this.path })
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
    return executeGitCommand(command, { cwd: this.path })
      .then(res => filelistFormatter(res))
      .catch((err) => {
        console.error(err);
        return [];
      });
  }

  getBranchCommits(branchName) {
    const command = ['log', branchName, '--pretty=format:%at|%H|%s'];
    return executeGitCommand(command, { cwd: this.path })
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
    return executeGitCommand(command, { cwd: this.path })
      .then((res) => {
        const commitRows = res.split(/\n+/);
        const commitTree = commitRows[0].split(' ')[1];
        return this.getTreeFiles(commitTree);
      })
      .catch(err => console.error(err));
  }

  getTreeFiles(treeHash) {
    const treeCommand = ['cat-file', '-p', treeHash];
    return executeGitCommand(treeCommand, { cwd: this.path })
      .then(res => filelistFormatter(res))
      .catch(err => console.error(err));
  }

  showFile(fileHash) {
    const command = ['show', fileHash];
    return executeGitCommand(command, { cwd: this.path });
  }

  cloneRepo(repoUrl) {
    if (!isGitUrl(repoUrl)) {
      return Promise.reject();
    }
    return removeDir(this.path)
      .then(() => {
        const command = ['clone', '--bare', repoUrl, this.path];
        return executeGitCommand(command)
          .then(() => console.log('Репозиторий склонирован'))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

}

module.exports = GitApi;
