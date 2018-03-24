function getFileContent(fileHash) {
  return fetch(`/getfilecontent/${fileHash}`)
    .then(res => res.text().then(text => text))
    .catch(err => console.log(err));
}

export default getFileContent;
