const fs = require("fs");
// const { config } = require("./config");
let config = { path: "", key: {}, delete: {} };
var beautify = require("js-beautify").js_beautify;
let resultString = "";

async function Run() {
  const file = await fs.readFileSync(config.path);
  const fileArray = file.toString().split("\n");
  resultString = file.toString();
  const workingString = fileArray.slice(fileArray.length - 1);

  const gqlArrayObj = gqlString(workingString);
  replaceString(gqlArrayObj, workingString);
}

function gqlString(stringArray = [""]) {
  let res = [{ key: "", start: 0, end: 0 }];
  stringArray.forEach((row, index) => {
    if (row.search("gql`") >= 0) {
      const key = row
        .replace("const", "")
        .replace("export", "")
        .replace("= gql`", "")
        .replace(/ /g, "");
      res.push({ key, start: index });
    } else if (row.search("`;") >= 0) {
      res[res.length - 1].end = index;
    }
  });

  return res;
}

async function replaceString(
  param = [{ key: "", start: 0, end: 0 }],
  stringArray = [""]
) {
  param.forEach(async (row) => {
    if (config.key[row.key]) {
      const original = stringArray
        .slice(row.start, row.end)
        .toString()
        .replace(/,/g, "\n");
      const replace = config.delete[config.key[row.key]]
        .replace(/  /g, "")
        .replace(/\t/g, "");
      let chageString = original
        .replace(/  /g, "")
        .replace(/\t/g, "")
        .replace(replace, "")
        .replace(/\n\n/g, "\n")
        .replace(/\t\n/g, "");
      let gqlBeauty = beautify(
        chageString.replace(`export const ${row.key} = gql\`\n`, "")
      );
      chageString = `export const ${row.key} = gql\`\n` + gqlBeauty;
      resultString = resultString.replace(original, chageString);
    }
  });

  await fs.writeFileSync("Output.ts", resultString);
}

/**
 * @param {string} path source file path
 * @param {{[string]:string}} key  value is delete object key
 * @param {{[string]:string}} del value is removing string
 */
exports.GqlFormattor = function (path, key, del) {
  config = { path, key, delete: del };
  Run();
};

// Run();
