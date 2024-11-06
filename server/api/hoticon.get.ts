import fsp from "fs/promises";
import fs from "fs";
import path from "path";
export default defineEventHandler(async (event) => {
  let iconNames = await fsp.readdir(path.resolve(process.dev ? "./public/logo": '../public/logo'), {
    encoding: "utf8",
  });
  interface FilePaths {
    [key: string]: string;
  }
  let newIcons = iconNames
    .filter((icon) => path.extname(icon) === ".png")
    .reduce((acc: FilePaths, icon: string) => {
      acc[path.basename(icon, path.extname(icon))] = `/logo/${icon}`;
      return acc;
    }, {});
  return {
    code: 200,
    data: newIcons,
    message: "查询成功",
  };
});
