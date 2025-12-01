import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Page Name from Command
const pageName = process.argv[2];

if (!pageName) {
  console.log("❌ Please provide a page name:  npm run make:page Home");
  process.exit(1);
}

// Page Folder Path
const folderPath = path.join(__dirname, "..", "src", "pages", pageName);

// File Content Templates
const jsxContent = `import React from "react";
import * as S from "./${pageName}Page.styles";

const ${pageName}Page = () => {
  return (
    <S.Container>
      <S.Title>${pageName} Page</S.Title>
    </S.Container>
  );
};

export default ${pageName}Page;
`;

const styleContent = `import styled from "styled-components";

export const Container = styled.div\`
  padding: 20px;
\`;

export const Title = styled.h2\`
  color: #0077ff;
\`;
`;

// Create folder + files
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

fs.writeFileSync(path.join(folderPath, `${pageName}.jsx`), jsxContent);
fs.writeFileSync(path.join(folderPath, `${pageName}.styles.js`), styleContent);

console.log(`\n✅ Page Created Successfully!`);
console.log(`📁 Location: src/pages/${pageName}/\n`);
