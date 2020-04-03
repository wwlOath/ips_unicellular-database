import Vue from 'vue';
import iView from 'view-design';
import VueRouter from 'vue-router';
import {routers} from './router';
Vue.use(VueRouter);

iView.LoadingBar.config({
  color: '#19be6b',
  failedColor: '#f0ad4e',
  height: 1
});
// 路由配置
const RouterConfig = {
  mode: "history",
  base: "unicellular",
  routes: routers
};

export const router = new VueRouter(RouterConfig);
