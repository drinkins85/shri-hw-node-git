/*!
 * is-git-url <https://github.com/jonschlinkert/is-git-url>
 *
 * Copyright (c) 2014-2015, 2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isGitUrl(str) {
  const regex = /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/;
  return regex.test(str);
}

export default isGitUrl;
