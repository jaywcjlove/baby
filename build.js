const ejs = require("ejs");
const fs = require("fs-extra");
const path = require("path");
const minify = require("html-minifier").minify;
require("colors-cli/toxic");
const data = require('./data.json');

const tempPath = path.join(__dirname, "index.ejs");
const distPaht = path.join(__dirname, "dist");
const imgPaht = path.join(__dirname, "dist", "images");

fs.emptyDirSync(distPaht);
fs.copySync(path.join(__dirname, "public"), distPaht);
fs.copySync(path.join(__dirname, "images"), imgPaht);

// 数据倒序
const dataReverse = [...data].reverse();

// 将数据分组
const dataResult = [];
for (let i = 0, len = data.length; i < len; i += 10) {
  dataResult.push(data.slice(i, i + 10));
}
dataResult.forEach((item, index) => {
  if (item.length < 1) return;
  const lastNum = dataReverse.indexOf(item[item.length - 1]);
  ejs.renderFile(
    tempPath,
    {
      page: index,
      totalPage: dataResult.length, // 总页数
      datas: item, // 数据
      lastNum
    },
    {},
    (err, str) => {
      const file = path.join(
        distPaht,
        `index${index === 0 ? "" : index}.html`
      );
      const minifyHtml = minify(str, { collapseWhitespace: true });
      console.log(" Created -> " + file.green);
      fs.outputFileSync(file, minifyHtml);
    }
  );
});
