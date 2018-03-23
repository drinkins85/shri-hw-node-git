const executeGitCommand = require('./executeGitCommand');


class GitApi {
  constructor(path) {
    this.path = path;
    this.currentBranch = 0;
  }

  cloneRepo(repoUrl) {
    // url verify
    const command = ['clone', '--bare', repoUrl, this.path];
    return executeGitCommand(command)
      .then(() => console.log('Репозиторий склонирован'))
      .catch(err => console.log(err));
  }

  getBranchList() {
    const command = ['branch'];
    return executeGitCommand(command, { cwd: this.path })
      .then((res) => {
        const branches = res.split(/\n\s*/).filter(brName => brName !== '');
        for (let i = 0; i < branches.length; i++) {
          if (branches[i][0] === '*') {
            branches[i] = branches[i].slice(2);
            this.currentBranch = i;
            break;
          }
        }
        return {
          list: branches,
        };
      });
  }

  getBranchFiles() {

  }

  getCommitFiles() {

  }

  getCommits() {

  }

  showFile() {

  }
}

module.exports = GitApi;
