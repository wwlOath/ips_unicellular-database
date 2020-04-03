/*动态加载组件*/
export default (url) =>()=>import(`@/components/${url}.vue`)

