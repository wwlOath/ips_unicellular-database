
import lazyLoading from './lazyLoading.js';

let util = {};

util.title = function (title) {
  title = title || '单细胞数据库';
  window.document.title = title;
};

util.inOf = function (arr, targetArr) {
  let res = true;
  arr.forEach(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false;
    }
  });
  return res;
};

util.oneOf = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true;
  } else {
    return false;
  }
};

util.getRouterObjByName = function (routers, name) {
  if (!name || !routers || !routers.length) {
    return null;
  }
  // debugger;
  let routerObj = null;
  for (let item of routers) {
    if (item.name === name) {
      return item;
    }
    routerObj = util.getRouterObjByName(item.children, name);
    if (routerObj) {
      return routerObj;
    }
  }
  return null;
};

util.handleTitle = function (vm, item) {
  if (typeof item.title === 'object') {
    return vm.$t(item.title.i18n);
  } else {
    return item.title;
  }
};

util.setCurrentPath = function (vm, name) {
  let currentPathArr = [];

  let currentPathObj = vm.$store.state.app.routers.filter(item => {
    if (item.children.length <= 1) {
      return item.children[0].name === name;
    } else {
      let i = 0;
      let childArr = item.children;
      let len = childArr.length;
      while (i < len) {
        if (childArr[i].name === name) {
          return true;
        }
        i++;
      }
      return false;
    }
  })[0];

  if (typeof(currentPathObj)!="undefined" && currentPathObj.children.length <= 1) {
    currentPathArr = [
      {
        title: currentPathObj.title,
        path: '',
        name: name
      }
    ];
  }else if(typeof(currentPathObj)!="undefined"){
    let childObj = currentPathObj.children.filter((child) => {
      return child.name === name;
    })[0];

    if(currentPathObj.path == ''){
      currentPathArr = [
        {
          title: childObj.title,
          path:  childObj.path,
          name: name
        }
      ];
    }else{
      currentPathArr = [
        {
          title: currentPathObj.title,
          path: '',
          name: currentPathObj.name
        },
        {
          title: childObj.title,
         /* path: currentPathObj.path + '/' + childObj.path,*/
          path: childObj.path,
          name: name
        }
      ];

    }

  }

  vm.$store.commit('setCurrentPath', currentPathArr);

  return currentPathArr;
};


util.openNewPage = function (vm, name, argu, query) {
  vm.$store.commit('setCurrentPageName', name);
};

util.toDefaultPage = function (routers, name, route, next) {
  let len = routers.length;
  let i = 0;
  let notHandle = true;
  while (i < len) {
    if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {
      route.replace({
        name: routers[i].children[0].name
      });
      notHandle = false;
      next();
      break;
    }
    i++;
  }
  if (notHandle) {
    next();
  }
};

util.fullscreenEvent = function (vm) {
  vm.$store.commit('initCachepage');
};

export default util;
