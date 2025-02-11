import fs from "fs";

const readFile = async (path) => {
  try {
    const data = await fs.promises.readFile(path, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const writeFile = async (path, data) => {
  try {
    await fs.promises.writeFile(path, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(error);
  }
};

export { readFile, writeFile };
