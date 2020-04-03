const user = {
  state:{
     userId: null,
     username: null,
     count: 0
  },
  mutations:{
    setUserId(state,userId){
      state.userId = userId
    },
    setUsername(state,username){
      state.username = username
    },
    setNoticeCount(state, count) {
      state.count = count;
    }
  },
  actions:{
    logout ({commit, state}, vm) {
      // 清空打开的页面等数据
      window.localStorage.clear();
      vm.$router.push({
        name: 'Home'
      });
    }
  },
  "namespaced": true,
};

export default user;
