module.exports = function(localName, path) {
  const uWebPath = path.match(/scaffold\/app\/web\/src\/components\/(.*)/)[1];
  const arr = uWebPath
    .split('/')
    .map(a => a.replace(/([A-Z])/g, '-$1'))
    .map(a => a.toLowerCase());
  arr.pop();
  return `u_webant${arr.join('-')}-${localName}`.replace('--', '-');
};
