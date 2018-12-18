/**
 * 将js 中引入的 antd 组件加入到 css 和 less 中
 * antd/lib/button
 * 在 css.js 中加入 require('antd/lib/button/style/css')
 * 在 less 中加入 @import '~antd/lib/button/style/index.less';
 */
const fs = require('fs');
const pathTool = require('path');
const { createStyleFolder, appentContent } = require('./createStyleFolder');

// const components = require('../components.config.js');

createStyleFolder('../lib');
// 所有使用过的 ant 组件
// 之所以是个对象是为了去重

const addAntlibtoStyle = function(parentsFolder) {
  const needToFixLibMap = {};
  const loop = parents => {
    const paths = fs.readdirSync(pathTool.join(__dirname, parents));
    const antdLibMap = {};
    paths.forEach(path => {
      if (path === '_utils') {
        return;
      }
      const fileStatus = fs.lstatSync(pathTool.join(__dirname, parents, path));
      if (fileStatus.isFile() && path.indexOf('.js') > -1) {
        const relaPath = pathTool.join(__dirname, parents, path);
        const jsString = fs.readFileSync(relaPath).toString();

        const localExecArray = jsString.match(/(\.\.\/)(\w*((-)*\w+)*)/gi);
        const execArray = jsString.match(/(antd\/lib\/)(\w*((-)*\w+)*)/gi);
        if (!execArray && !localExecArray) {
          return;
        }
        const cssPathString = [];
        const lessPathString = [];

        if (execArray) {
          execArray.forEach(antdLib => {
            if (!antdLibMap[antdLib]) {
              antdLibMap[antdLib] = true;
              cssPathString.push(`require('${antdLib}/style/css');`);
              lessPathString.push(`require('${antdLib}/style/index');`);
            }
          });
        }
        if (localExecArray) {
          localExecArray.forEach(localLib => {
            if (localLib !== '../_utils' && localLib !== '../Script') {
              cssPathString.push(`require('../${localLib}/style/css');`);
              lessPathString.push(`require('../${localLib}/style/index');`);
              let arr = needToFixLibMap[parents];
              if (!arr) {
                arr = [];
              }
              const willAddPath = localLib.replace('../', '');
              if (willAddPath && !arr.includes(willAddPath)) {
                arr.push(willAddPath);
                needToFixLibMap[parents] = arr;
              }
            }
          });
        }

        const stylePath = pathTool.join(__dirname, parents, 'style');
        if (stylePath.includes('style/style')) {
          return false;
        }
        if (!fs.existsSync(stylePath)) {
          fs.mkdirSync(stylePath);
        }
        // appent to css.js
        const cssJsPath = pathTool.join(__dirname, parents, 'style/css.js');
        appentContent(cssJsPath, cssPathString.join('\n'));

        // appent to index.js
        const lessJsPath = pathTool.join(__dirname, parents, 'style/index.js');
        appentContent(lessJsPath, lessPathString.join('\n'));
      }
      if (fileStatus.isDirectory()) {
        loop(pathTool.join(parents, path));
      }
    });
  };

  const fix = fixMap => {
    Object.keys(fixMap).forEach(parents => {
      const arr = fixMap[parents];
      const cssJsPath = pathTool.join(__dirname, parents.replace('/style', ''), 'style/css.js');
      const lessJsPath = pathTool.join(__dirname, parents.replace('/style', ''), 'style/index.js');

      arr.forEach(path => {
        const willAppentContentCssJsPath = pathTool.join(
          __dirname,
          `../lib/${path}`,
          'style/css.js'
        );

        if (fs.existsSync(willAppentContentCssJsPath)) {
          const willAppentContentJsCssString = fs
            .readFileSync(willAppentContentCssJsPath)
            .toString();
          const cssJsString = fs.readFileSync(cssJsPath).toString();

          const cssPathString = [];
          const lessPathString = [];

          const execArray = willAppentContentJsCssString.match(/(antd\/lib\/)(\w*((-)*\w+)*)/gi);
          if (execArray) {
            const hadArray = cssJsString.match(/(antd\/lib\/)(\w*((-)*\w+)*)/gi);
            if (hadArray) {
              execArray.filter(item => hadArray.includes(item));
            }
            if (execArray.length > 0) {
              execArray.forEach(antdLib => {
                cssPathString.push(`require('${antdLib}/style/css');`);
                lessPathString.push(`require('${antdLib}/style/index');`);
              });
            }
          }
          appentContent(cssJsPath, cssPathString.join('\n'));
          appentContent(lessJsPath, lessPathString.join('\n'));
        }
      });
    });
  };
  loop(parentsFolder);
  fix(needToFixLibMap);
};

addAntlibtoStyle('../lib');
