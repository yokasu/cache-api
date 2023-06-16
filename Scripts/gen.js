import fs from "fs";
import path from "path";
import { dirname } from "path";

const packageJsonPath = "../package.json";
const __dirname = dirname(
  new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1")
);
function toCamelCase(str, seperator = "-") {
  return str
    .split(seperator)
    .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
    .join("");
}
try {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, packageJsonPath), "utf8")
  );
  const readme = `# ${pkg.name}
  
  ${pkg.description}
  
  ## 安装
  
  \`\`\`bash
  npm install ${pkg.name} --save
  \`\`\`
  
  ## 使用
  // 案例一
  \`\`\`javascript
  import ${toCamelCase(pkg.name)} from '${pkg.name}';
  import request from '@/utils/request'
  export const getList = new ${toCamelCase(pkg.name)}((data) => {
    request({
      url: 'user/list',
      method: 'get',
      data
    })
  })
  // .vue
  import { getList } from '@/api/user'
  const data = {
    current: 1,
    pageSize: 10,
  }

  getList.send(data).then(res => {

  })

  getList.forceSend(data).then(res => {

  })

  getList.send(data, true).then(res => {

  })

  \`\`\`
  // 案例二
  \`\`\`javascript
  import { createCacheAPI } from '${pkg.name}';
  import request from '@/utils/request'
  const getList = (data) => {
    request({
      url: 'user/list',
      method: 'get',
      data
    })
  }
  export const getListCache = createCacheAPI(getListRaw, {
    filters: [res => res],
  })
  // .vue
  import { sendCacheAPI } from 'cache-api'
  import { getList } from '@/api/user'
  const data = {
    current: 1,
    pageSize: 10,
  }

  sendCacheAPI("getList")(data).then(res => {

  })

  sendCacheAPI(getList)(data).then(res => {

  })
  
  sendCacheAPI(getList, true)(data).then(res => {

  })
  \`\`\`
  
  ## 许可证
  
  ${pkg.license} © ${pkg.author}
  `;
  fs.writeFileSync(path.join(__dirname, "../README.md"), readme);
} catch (err) {
  console.error(`Failed to read file '${packageJsonPath}': ${err}`);
}

// 写入 README.md 文件
