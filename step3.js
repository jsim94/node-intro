const axios = require("axios");
const fs = require("fs");
const process = require("process");

function cat(path) {
  let text = null;
  try {
    text = fs.readFileSync(path, "utf-8");
  } catch (e) {
    if (e.code === "ENOENT") {
      console.error(`ERROR: "${path}" not found.`);
      process.exit(9);
    }
    process.exit(1);
  }
  return text;
}

async function webCat(path) {
  let resp;
  try {
    resp = await axios.get(path);
    if (resp.status === 200) {
      return resp.data;
    }
  } catch (e) {
    if (e.code === "ERR_BAD_REQUEST") {
      console.error(`Error: Request failed.`);
      process.exit(1);
    }
  }
}

async function run() {
  const [savePath, path] = (() => {
    let savePath = null;
    let path = null;
    if (process.argv[2] === "--out") {
      savePath = process.argv[3];
      path = process.argv[4];
    } else {
      path = process.argv[2];
    }
    return [savePath, path];
  })();
  const data = await (path.indexOf("http") === 0 ? webCat(path) : cat(path));
  if (savePath) {
    try {
      fs.writeFileSync(savePath, data, "utf8");
    } catch (e) {
      if (e.code === "ENOENT") {
        console.error(`Error saving to file "${savePath}`);
      }
    }
    console.log(`Saved to ${savePath}`);
    process.exit(0);
  }
  console.log(data);
}

run();
