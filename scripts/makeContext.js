import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ctxName = process.argv[2];

if (!ctxName) {
  console.log("❌ Provide context name: npm run make:ctx Auth");
  process.exit(1);
}

const folder = path.join(__dirname, "..", "src", "context");

const content = `import { createContext } from "react";

export const ${ctxName}Context = createContext(null);
`;

fs.writeFileSync(path.join(folder, `${ctxName}Context.js`), content);

console.log(`\n✅ Context Created: ${ctxName}Context`);
