import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getDirname = (meta) => {
  const __filename = fileURLToPath(meta);
  const __dirname = dirname(__filename);
  return __dirname;
};

export default __dirname;
