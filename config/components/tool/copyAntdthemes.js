const fs = require('fs-extra');
const path = require('path');

const copyAntdthemes = () => {
  console.log('copyAntdthemes start');
  const AntdthemesPath = path.join(__dirname, '../../../node_modules/antd/lib/style/');
  const myThemesPath = path.join(__dirname, '../lib/style/');
  fs.copySync(`${AntdthemesPath}/themes`, `${myThemesPath}/themes`);
  fs.copySync(`${AntdthemesPath}/color`, `${myThemesPath}/color`);
  console.log('copyAntdthemes start');
};
module.exports = copyAntdthemes;
