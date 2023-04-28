// 该文件需要提交

// 登陆后立即调用（此文件可以手动修改）
// 该导出的方法将会在 登陆之后（saber 中的 layout.vue 中） 立即调用
// 所以，如果子系统有些功能需要在登陆之后就展示（如通知、接口轮询等），可以在该文件调用

/*
 * @param {boolean} isSaas 是否是租户平台
 * @this {import('vue').default}
 */
export default function callImmediate(isSaas) {
  // 此处的 `this` 指向 `layout.vue` 组件实例
}
