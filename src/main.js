// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'view-design'
import App from './App'
import {router} from './router/index'
import store from './store'
import './assets/iview-theme/index.less'
import VueI18n from 'vue-i18n';
import '@/locale'
import Icon from 'vue-awesome/components/Icon'

//滚动条
import vuescroll from 'vuescroll/dist/vuescroll-native';

import {getRequest, postRequest, getRequestPhoto} from '@/libs/axios'
import {setStore, getStore, removeStore} from '@/libs/storage'
import util from '@/libs/util';

import echarts from 'echarts';

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
Vue.use(VueI18n);
Vue.use(iView);
Vue.component('icon', Icon);

Vue.use(vuescroll, {
  ops: {
    vuescroll: {
      mode: 'native',
      sizeStrategy: 'number',
      // detectResize: true
    },
    scrollPanel: {
      initialScrollY: false,
      initialScrollX: false,
      scrollingX: false, //默认是否启动x方向的滚动
      scrollingY: true,
      speed: 300,
      easing: undefined,
      verticalNativeBarPos: 'right'
    },
    rail: { //滚动条所在位置
      background: '#01a99a',
      opacity: 0,
      size: '6px',
      specifyBorderRadius: false,
      gutterOfEnds: null,
      //gutterOfSide: '2px',
      keepShow: false
    },
    bar: {
      showDelay: 500,
      onlyShowBarOnScroll: true,
      keepShow: false,
      background: '#c1c1c1',
      opacity: 0.7,
      hoverStyle: false,
      specifyBorderRadius: false,
      minSize: 0.1,
      size: '5px',
      disable: false,
    }
  }
});
// 挂载全局使用的方法
Vue.prototype.getRequest = getRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.setStore = setStore;
Vue.prototype.getStore = getStore;
Vue.prototype.removeStore = removeStore;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  data: {

  },
  mounted() {
    //util.initRouter(this);
  }
})
