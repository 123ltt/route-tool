interface Location {
  name?: string
  path?: string
  hash?: string
  query?: Record<string, string | (string | null)[] | null | undefined>
  params?: Record<string, string>
  append?: boolean
  replace?: boolean
}

type Fn = (...args: any[]) => void
/**
 * 打开tab页面，并添加回调
 */
export const staticRouteOpen = (location: string | Location, cb: Fn) => {}

/**
 * 传递参数给回调函数并执行
 */
export const staticRouteUpdate = (...args: any[]) => {}

/**
 * 传递参数给回调函数并执行，并且关闭当前tab页面
 */
export const staticRouteClose = (...args: any[]) => {}

interface StaticRoute {
  /**
   * 路由名称，为空则会自动将 `path` 转换成大驼峰作为路由名称
   */
  name?: string;
  /**
   * 路由路径
   * 
   * 路由定义规则： 父页面的路径 + 后缀。
   * 如： 从 `/a/b` 页面跳转到添加页面，则添加页面的路由为 `/a/b/add`
   * 
   * 因为路由权限规则是 如果菜单中包含 `/a/b` 路由，则 `/a/b/add` 也会有访问权限
   */
  path: string;
  /** 
   * 路由对应的组件
   * 
   * 格式为 `() => import('...')` 
   */
  component: () => any;
  /** 
   * tab 标签和浏览器标签显示的名称。默认使用父级页面的标题
   * 
   * 如果是动态标题，可在组件内使用 `staticRouteSetTitle` 方法设置标题
   */
  title?: string;
  /**
   * 路由组件传参，具体使用请查看 https://router.vuejs.org/zh/guide/essentials/passing-props.html
   */
  props?: boolean | Record<string, any> | ((route: any) => any);
  /**
   * 是否启用页面缓存。默认启用
   * @default true 启用 
   */
  keepAlive?: boolean;
}

interface Route {
  name: string;
  path: string;
  component: () => any;
  meta: {
    name: string;
    [K: string]: any;
  }
}

/**
 * 定义静态路由
 */
export const defineStaticRoute = (data: StaticRoute[]) => ({} as Route);
