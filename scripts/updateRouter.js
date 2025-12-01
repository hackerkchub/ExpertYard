import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pageName = process.argv[2];

if (!pageName) {
  console.log("❌ Please provide a page name");
  process.exit(1);
}

const routerPath = path.join(__dirname, "..", "src", "router", "AppRouter.jsx");

// Read file
let content = fs.readFileSync(routerPath, "utf8");

const importLine = `import ${pageName}Page from "../pages/${pageName}/${pageName}Page";`;
const routeLine = `        <Route path="/${pageName.toLowerCase()}" element={<${pageName}Page />} />`;

// Insert import (if not already)
if (!content.includes(importLine)) {
  content = content.replace(
    /import[^]*?from[^]*?;\n/,
    (match) => match + importLine + "\n"
  );
}

// Insert route (before closing Routes tag)
if (!content.includes(routeLine)) {
  content = content.replace(
    /(<\/Routes>)/,
    `${routeLine}\n    $1`
  );
}

// Write updated router file
fs.writeFileSync(routerPath, content);

console.log(`\n✅ Route Added Successfully!`);
console.log(`➡ /${pageName.toLowerCase()}`);
console.log(`📌 Updated: src/router/AppRouter.jsx\n`);
