import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compName = process.argv[2];

if (!compName) {
  console.log("❌ Please provide a component name: npm run make:comp Navbar");
  process.exit(1);
}

const folderPath = path.join(__dirname, "..", "src", "components", compName);

const jsxContent = `import React from "react";
import * as S from "./${compName}.styles";

const ${compName} = () => {
  return (
    <S.Container>
      <S.Title>${compName} Component</S.Title>
    </S.Container>
  );
};

export default ${compName};
`;

const styleContent = `import styled from "styled-components";

export const Container = styled.div\`
  padding: 20px;
\`;

export const Title = styled.h3\`
  color: #0077ff;
\`;
`;

// Create component folder
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

fs.writeFileSync(path.join(folderPath, `${compName}.jsx`), jsxContent);
fs.writeFileSync(path.join(folderPath, `${compName}.styles.js`), styleContent);

console.log(`\n✅ Component Created: ${compName}`);
console.log(`📁 Location: src/components/${compName}/\n`);
