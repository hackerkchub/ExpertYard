import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hookName = process.argv[2];

if (!hookName) {
  console.log("❌ Provide hook name: npm run make:hook useUser");
  process.exit(1);
}

const folder = path.join(__dirname, "..", "src", "hooks");

const content = `import { useState } from "react";

export const ${hookName} = () => {
  const [state, setState] = useState(null);

  return { state, setState };
};
`;

fs.writeFileSync(path.join(folder, `${hookName}.js`), content);

console.log(`\n✅ Hook Created: ${hookName}`);
