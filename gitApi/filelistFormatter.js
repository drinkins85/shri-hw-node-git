module.exports = function (stdout) {
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
};
