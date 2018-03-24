import isGitUrl from './isGitUrl';

function uploadRepo(repoUrl) {
  if (isGitUrl(repoUrl)) {
    return fetch('/git-clone', {
      method: 'POST',
      body: repoUrl,
    })
      .then(res => res)
      .catch(err => console.log(err));
  }
  return Promise.reject();
}

export default uploadRepo;

