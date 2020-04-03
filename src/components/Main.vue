
<template>
  <div class="layout">
    <Layout>
      <Header class="my-header">
          <!--<div class="layout-logo"></div>-->
          <div class="layout-nav">
            <Menu ref="sideMenu"  mode="horizontal" :active-name="$route.name" theme="dark" @on-select="changeMenuRouter">
              <MenuItem name="database_home_index">
                <Icon type="ios-home" />
                Home
              </MenuItem>
              <MenuItem name="database_list_index">
                <Icon type="ios-search" />
                List
              </MenuItem>
              <MenuItem name="database_visual_index">
                <Icon type="ios-search" />
                Visual
              </MenuItem>

              <div v-if="userInfo == ''">
                <div class="right-login-btn">
                  <Button type="dashed" ghost @click="jumpToLogin">Login</Button>
                </div>
              </div>
              <div v-else>
                <Dropdown transfer trigger="hover" @on-click="handleClickUserDropdown" style="margin-left:32px;float:right">
                  <a href="javascript:void(0)" v-if="isUpdateData">

                    <span v-if="count > 0">
                      <Badge dot class="countMessage">
                        <Avatar :src="avatarPathImg == '' ? avatarPath : avatarPathImg" shape="circle" ></Avatar>
                      </Badge>
                    </span>
                    <span v-else>
                        <Avatar :src="avatarPathImg == '' ? avatarPath : avatarPathImg" shape="circle" ></Avatar>
                    </span>
                    <span class="main-user-name">{{ username }}
                      <Icon type="md-arrow-dropdown" />
                    </span>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="ownSpace"><Icon type="md-person" /> Account and Security</DropdownItem>
                    <DropdownItem name="loginout" divided><Icon type="md-exit" /> Logout</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </Menu>
          </div>
      </Header>

      <Content class="my-content">
          <div class="item-info">
            <div class="single-page">
              <keep-alive :include="cachePage">
                <router-view></router-view>
              </keep-alive>
            </div>
          </div>
      </Content>

      <Footer class="layout-footer-center">
        Copyright © 2018 <a href="http://www.myhealthgene.com/" target="_blank" style="color:#505050">万康源（天津）基因科技有限公司</a> All
        Rights Reserved
      </Footer>
    </Layout>

  </div>
</template>

<style lang="less" scoped>
  .notice-unread {
    display: inline-block;
    float: right;
    color: #fff;
    padding-top: 10px;
  }

  .right-login-btn {
    float: right;
  }
  .layout-footer-center {
    background: rgba(0, 0, 0, 0.4);
    padding: 15px 50px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    margin-top: 120px;
  }
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .ivu-menu-horizontal .ivu-menu-submenu .ivu-select-dropdown .ivu-menu-item{
    width:168px
  }

  .main-breadcrumb{
    background: #fff;
    margin: 10px;
    color: #000;
    padding: 10px;
    border-radius: 3px;
    box-shadow: 0 0 1px rgba(0,0,0,.54);
  }

  .ivu-breadcrumb{
    font-size: 9px;
  }
  .main-user-name{
    color: #ffffff;
    font-size: 16px;
  }
  .my-content {
 /*   overflow: hidden;*/
    background-size: cover;
    min-height: 700px;
    width: 100%;
    min-width: 1050px;
    background: #f5f7f9;
    margin-top: 30px;
  }

  .my-content .item-info {
    padding-bottom: 20px;
  }

  .my-header {
    background: #337ab7;
    background-size: cover;
    color: white;
    position: relative;
    z-index: 11;
    box-shadow: 0 1px 1px 1px rgba(0, 0, 0, .1);
    min-width: 1050px;
    .ivu-menu-item {
      font-size: 16px;
    }
  }

  .ivu-menu-dark {
    background-color: transparent;
  }

  .ivu-layout-header {
    padding: 0 20px
  }
  .ivu-menu-horizontal .ivu-menu-item, .ivu-menu-horizontal .ivu-menu-submenu{
    padding:0 10px;
  }

  .layout-logo {
    width: 148px;
    height: 48px;
    background: url(../assets/logo.png) repeat 0 0;
    background-size: cover;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 7px;
    left: 0px;
  }

  .single-page {
    z-index: 1;
    transition: left .3s;
    margin: 5px 20px 0px 20px;
  }
</style>

<script>
  import breadcrumbNav from "./main-components/breadcrumb-nav.vue";
  import util from "@/libs/util.js";
  import Vue from "vue";
  import VueI18n from "vue-i18n";
  Vue.use(VueI18n);
  import {mapActions,mapState} from "vuex";
  import {getStore,setStore,removeStore} from '@/libs/storage';
  import {
    getNoticeDataList
  } from '@/api/index';

  import {
    logoutInterface
  } from '@/api/user';

  import {
    isLoginStatus
  } from '@/api/user';

  export default {
    components: {
      breadcrumbNav,
    },
    data() {
      return {
        iconSize: 20,
        username: "",
        userId: "",
        isFullScreen: false,
        openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
        ops: {
          bar: {
            keepShow: false,//滚动条是否保持显示。
            background: '#c1c1c1',//滚动条背景色
          }
        },
        isUpdateData: true,
        avatarPathImg: '',
        userInfo: '',
        noticeCount: ''
      };
    },
    computed: {
      count: {
        get() {
          return this.$store.state.user.count;
        },
        set(val) {
          this.$store.state.user.count = val;
        }
      },
      currentPath() {
        return this.$store.state.app.currentPath; // 当前面包屑数组
      },
      cachePage() {
        return this.$store.state.app.cachePage;
      },
      avatarPath() {
        return localStorage.avatorImgPath;
      },
      lang() {
        return this.$store.state.app.lang;
      },
      /*  mesCount() {
          return this.$store.state.app.messageCount;
        }*/
    },
    stompClient: {
      monitorIntervalTime: 100,
      stompReconnect: true,
      timeout(orgCmd) {}
    },
    methods: {
      ...mapActions("user",["logout"]),
      itemTitle(item) {
        if (typeof item.name === "object") {
          return this.$t(item.name.i18n);
        } else {
          return item.name;
        }
      },
      init() {
        util.setCurrentPath(this, this.$route.name);

        if(this.getStore("unicellularUserInfo")){
          let userInfo = JSON.parse(this.getStore("unicellularUserInfo"));
          this.userInfo = userInfo;
          this.username = userInfo.userName;
          this.userId = userInfo.id;
        }else {
          this.userInfo = '';
        }
      },
      handleLanDropdown(name) {
        localStorage.lang = name;
        this.$store.commit("switchLang", name);
      },
      handleClickUserDropdown(name) {
        if (name === "ownSpace") {
          this.$router.push({
            path: "/ownspace"
          });
        }else if (name === "loginout") {
          logoutInterface().then(res => {
            if(res.status == 0){
              console.log('success')
            }
          })
          // 退出登录
          this.logout(this);
          // 强制刷新页面 重新加载router
          location.reload();
        }
      },
      beforePush(name) {
        // console.log(name)
        return true;
      },
      jumpToLogin() {
        this.$router.push({
          name: "login"
        });
      },
      getNoticeCount() {
        let params = {
          page: 1,
          limit:  10,
          sidx: '',
          order: 'asc',
        };
        getNoticeDataList(params).then(res => {
          if(res.status == '0'){
            this.noticeCount = res.data.totalCount;
            this.count = this.noticeCount;
          }
        })
      },
      getLoginStatus() {
        isLoginStatus().then(res => {
          if(res.status != 0){
            this.removeStore("unicellularUserInfo");
            this.userInfo = '';
            this.$router.push({
              name: 'Home'
            })
          }
        })
      },
      //菜单切换
      changeMenuRouter(value){
        let route = "";
        switch (value) {
          case "database_home_index":
            route = "/home";
            break;
          case "database_list_index":
            route = "/list";
            break;
          case "database_visual_index":
            route = "/visual";
            break;
        }
        route && this.$router.push(route);
      }
    },
    watch: {
      $route(to) {
        this.$store.commit("setCurrentPageName", to.name);
        util.setCurrentPath(this, to.name);

        localStorage.currentPageName = to.name;
      },
      lang() {
        util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
      }
    },
    mounted() {
      this.init();
      //this.getLoginStatus();
      let userInfo = this.getStore("unicellularUserInfo");
      if(userInfo != '' && userInfo != null){
        this.getNoticeCount();
      }
    },
    created() {

    }
  };
</script>
