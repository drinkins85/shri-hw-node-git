const executeGitCommand = require('./executeGitCommand');
const filelistFormatter = require('./filelistFormatter');


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
    const command = ['branch', '--list'];
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
        return branches;
      });
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

  getCommitFiles() {

  }

  getCommits() {

  }

  showFile() {

  }
}

module.exports = GitApi;
