const fs = require("fs");
const process = require("process");

function cat(path) {
  const text = fs.readFileSync(path, "utf-8");
  console.log(text);
}
cat(process.argv[2]);
