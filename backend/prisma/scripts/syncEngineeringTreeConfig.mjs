/**
 * Regenerates prisma/config/specializations.json and engineeringTree.json
 * from the frontend engineering tree source of truth.
 *
 * Usage: node prisma/scripts/syncEngineeringTreeConfig.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const treeSourcePath = join(
  __dirname,
  "..",
  "..",
  "..",
  "frontend",
  "src",
  "data",
  "engineeringTree.ts"
);
const configDir = join(__dirname, "..", "config");

const source = readFileSync(treeSourcePath, "utf-8");
const start = source.indexOf("export const engineeringTree");
const eq = source.indexOf("=", start);
const arrStart = source.indexOf("[", eq);

let depth = 0;
let arrEnd = -1;

for (let index = arrStart; index < source.length; index += 1) {
  if (source[index] === "[") {
    depth += 1;
  } else if (source[index] === "]") {
    depth -= 1;
    if (depth === 0) {
      arrEnd = index;
      break;
    }
  }
}

const body = source.slice(arrStart, arrEnd + 1);
const specialization = (id, name) => ({ id, name });
const tree = new Function("specialization", `return ${body}`)(specialization);

const specializations = [];

for (const discipline of tree) {
  let displayOrder = 1;

  const walk = (nodes) => {
    for (const node of nodes) {
      if (node.children?.length) {
        walk(node.children);
        continue;
      }

      specializations.push({
        id: node.id,
        disciplineId: discipline.id,
        name: node.name,
        displayOrder,
        active: true,
      });
      displayOrder += 1;
    }
  };

  if (discipline.children) {
    walk(discipline.children);
  }
}

writeFileSync(
  join(configDir, "engineeringTree.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      schema: "sarathi-engineering-tree-v1",
      tree,
    },
    null,
    2
  )
);

writeFileSync(
  join(configDir, "specializations.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      schema: "sarathi-specializations-v1",
      specializations,
    },
    null,
    2
  )
);

console.log(
  `Synced ${tree.length} disciplines and ${specializations.length} specializations.`
);
