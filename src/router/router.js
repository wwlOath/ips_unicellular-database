import Main from '@/components/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
/*登录路由*/
export const defaultRouter={
  path:"/",
  redirect: '/home',
}

export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: ''
    },
    component: () => import('@/components/login.vue')
};

export const registRouter = {
  path: '/regist',
  name: 'regist',
  meta: {
    title: ''
  },
  component: () => import('@/components/regist.vue')
};


/*export const page404 = {
     path: '/!*',
     name: 'error-404',
     meta: {
        title: '404-页面不存在'
     },
     component: () => import('@/components/error-page/404.vue')
};*/

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/components/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/components/error-page/500.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    component: Main,
    children: [
      { path: 'ownspace', name: 'Account and Security', title: '', component: () => import('@/components/main-components/ownspace.vue') },
      { path: 'home', name: 'database_home_index', title: '', component: () => import('@/components/database/home.vue') },
      { path: 'list', name: 'database_list_index', title: '', component: () => import('@/components/database/unicellularList.vue') },
      { path: 'visual', name: 'database_visual_index', title: '', component: () => import('@/components/database/queryModuleVisual.vue') },
    ]
};

export const appRouter = [];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    defaultRouter,
    loginRouter,
    registRouter,
    otherRouter,
    ...appRouter,
    page500,
    page403

];
