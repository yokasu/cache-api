# cache-api
  
  cache data from display api.useful for working on the front end.
  
  ## 安装
  
  ```bash
  npm install cache-api --save
  ```
  
  ## 使用
  // 案例一
  ```javascript
  import CacheApi from 'cache-api';
  import request from '@/utils/request'
  export const getList = new CacheApi((data) => {
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

  ```
  // 案例二
  ```javascript
  import { createCacheAPI } from 'cache-api';
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
  ```
  
  ## 许可证
  
  ISC © yokasu
  