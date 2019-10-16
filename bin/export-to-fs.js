#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const entries = require(process.argv[2]);
const base = "/tmp/new-journal";
entries.forEach(entry => {
  const dest = path.join(base, getPath(entry));
  const dir = path.dirname(dest);
  const body = `# ${entry.created}
${entry.body}

`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(dest, body, { flag: "a" });
});

function getPath(entry) {
  const ymd = entry.created.split("T", 1)[0];
  const [year, month, day] = ymd.split("-");
  const tag = entry.tags[0] || "general";
  return `${tag}/${year}/${month}-${day}.md`;
}
