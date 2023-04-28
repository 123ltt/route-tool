# 自动生成路由

## 使用
```js
// es module用法：
import RouteTool from 'route-tool'

// commonjs用法：
// const RouteTool = require('route-tool').default

RouteTool({
  routesWritePath: 'route.js'
})
```

## options
```ts
type Options = {
  /** 保存路由文件的路径（相对项目根目录） */
  routesWritePath: string;
  /** chunkName 取目录的深度（会自动过滤重复的名称）。默认 `1` */
  chunkDepth?: number;
  /** 系统名称，用作 chunkName 的第一级 */
  systemName: string;
  /** 是否启用watch，默认`true` */
  watch?: boolean;
  /** api前缀映射关系 */
  apiPrefix: [string, string][];
  /** 额外导出的数据 */
  exports?: { [key: string]: string }
}
```