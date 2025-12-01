import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const layoutName = process.argv[2];

if (!layoutName) {
  console.log("❌ Provide a layout name: npm run make:layout Main");
  process.exit(1);
}

const folder = path.join(__dirname, "..", "src", "layouts", layoutName);

const jsxContent = `import React from "react";
import * as S from "./${layoutName}.styles";

const ${layoutName} = ({ children }) => {
  return (
    <S.Container>
      {children}
    </S.Container>
  );
};

export default ${layoutName};
`;

const styleContent = `import styled from "styled-components";

export const Container = styled.div\`
  width: 100%;
  min-height: 100vh;
\`;
`;

if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

fs.writeFileSync(path.join(folder, `${layoutName}.jsx`), jsxContent);
fs.writeFileSync(path.join(folder, `${layoutName}.styles.js`), styleContent);

console.log(`\n✅ Layout Created: ${layoutName}`);
