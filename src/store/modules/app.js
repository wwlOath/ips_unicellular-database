import { otherRouter } from '@/router/router';
import { router } from '@/router/index';
import Vue from 'vue';

const app = {
    state: {
        cachePage: [],
        lang: '',
        menuTheme: 'dark', // 主题
        themeColor: '',
        currentPageName: '',
        currentPath: [
            {
              name: "home",
              title: "home",
              path: "home",
            }
        ],
        // 面包屑数组
        menuList: [],
        routers: [
            otherRouter
        ],
        // 在这里定义你不想要缓存的页面的name属性值(参见路由配置router.js)
        dontCache: ['test', 'test'],
    },
    mutations: {
        // 动态添加主界面路由，需要缓存
        updateAppRouter(state, routes) {
            state.routers.push(...routes);
            router.addRoutes(routes);
        },
        // 动态添加全局路由，不需要缓存
        updateDefaultRouter(state, routes) {
            router.addRoutes(routes);
        },
        updateMenulist(state, routes) {
            state.menuList = routes;
        },
        initCachepage(state) {
            if (localStorage.cachePage) {
                state.cachePage = JSON.parse(localStorage.cachePage);
            }
        },

        setCurrentPath(state, pathArr) {
            state.currentPath = pathArr;
        },
        setCurrentPageName(state, name) {
            state.currentPageName = name;
        },
        setAvatarPath(state, path) {
            localStorage.avatorImgPath = path;
        },
        switchLang(state, lang) {
            state.lang = lang;
            Vue.config.lang = lang;
        },
    },
};

export default app;
