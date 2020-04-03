<template>
  <div class="login-container">
    <div class="content-info">
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

              <div class="right-login-btn">
                <Button type="dashed" ghost @click="jumpToLogin">Login</Button>
              </div>
            </Menu>
          </div>
        </Header>

        <Content class="my-content">
          <Row type="flex" justify="center" align="middle" class="login" @keydown.enter.native="submitLogin">
            <Col :md="{span: 10}" :lg="{span: 6}" style="min-width:500px">
              <div>
                <Card :bordered="false" class="content">
                  <Row class="row-info">
                    <Col class="login-box-right" span="24">

                      <Row type="flex" justify="center" align="middle">
                        <Col span="2">
                        </Col>
                        <Col span="22">
                          <h3 class="login-title">Login</h3>
                          <Alert type="error" show-icon v-if="error">{{errorMsg}}</Alert>
                          <Row class="login-form">
                            <Form ref="usernameLoginForm" :model="form" :rules="rules" class="form">
                              <FormItem prop="username">
                                <Input v-model="form.username" prefix="ios-contact"  size="large"  clearable placeholder="Username" autocomplete="off" />
                              </FormItem>
                              <FormItem prop="password">
                                <Input type="password" v-model="form.password" prefix="ios-lock"  size="large"  clearable placeholder="Password" autocomplete="off" />
                              </FormItem>

                            </Form>

                            <Row :gutter="16" style="margin-bottom: 30px;">
                              <Col :span="12">
                                <Button class="login-btn" type="primary" size="large" :loading="loading" @click="submitLogin" long>
                                  <span v-if="!loading">Login</span>
                                  <span v-else>Logging...</span>
                                </Button>
                              </Col>
                              <Col :span="12">
                                <Button class="login-btn" type="default" size="large" @click="register" long>Register</Button>
                              </Col>
                            </Row>

                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card>
              </div>
            </Col>
          </Row>
        </Content>

        <Footer class="layout-footer-center">
          Copyright © 2018 <a href="http://www.myhealthgene.com/" target="_blank">万康源（天津）基因科技有限公司</a> All
          Rights Reserved
        </Footer>
      </Layout>

    </div>
  </div>
</template>

<style lang="less" scoped>
  @import "./login.less";

  .login-container {
    .content-info {
      min-height: calc(100vh - 130px);
    }
  }
  .ivu-menu-horizontal .ivu-menu-item, .ivu-menu-horizontal .ivu-menu-submenu{
    padding:0 10px;
  }
  .right-login-btn {
    float: right;
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
  .ivu-layout-header {
    padding: 0 20px;
  }
  .ivu-menu-dark {
    background-color: transparent;
  }

  .layout-footer-center {
    background: rgba(0, 0, 0, 0.4);
    padding: 15px 50px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    margin-top: 100px;
  }
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .content {
    -webkit-box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);

    .ivu-card-body {
      padding: 13px;
    }

    .row-info {
      background: rgba(255,255,255,0.5);
      border-radius: 5px;
      padding-right: 15px;

      .img-style {
        display: inline-block;
        background: rgba(255,255,255,0.6);
        border-radius: 20px;
      }

      .left-title {
        font-size: 26px;
        margin-top: 25px;
      }
    }
  }

  .content:after {
    content: '';
    background-size: cover;
    -webkit-filter: blur(2px);
    -moz-filter: blur(2px);
    -ms-filter: blur(2px);
    -o-filter: blur(2px);
    filter: blur(2px);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #e3e3e3;
    z-index: -1;
  }

  .login-title {
    font-size: 24px;
    text-align: center;
    margin: 30px auto 20px;
  }

</style>


<script>
import {
  login,
  userInfo,
  getCaptcha
} from "@/api/user";

import user_photo from '../assets/user_photo.png';
import util from "@/libs/util.js";

export default {
  data() {
    return {
      error: false,
      errorMsg: "",
      saveLogin: true,
      loading: false,
      form: {
        username: "",
        password: "",
      },
      iconSize: 20,
      isUpdateData: true,
      avatarPathImg: '',
      isCurrentAlive: true,
      userInfo: '',
      rules: {
        username: [
          {
            required: true,
            message: "userName cannot be empty",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "password cannot be empty",
            trigger: "blur"
          }
        ],
      },
      captchaImg: '',
      captchaUrl: '',
      captchaId:null,
    };
  },
  computed: {
    avatarPath() {
      return localStorage.avatorImgPath;
    },
  },
  methods: {
    jumpToLogin() {
      this.$router.push({
        name: "login"
      });
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
    },
    showErrorMsg(msg) {
      this.error = true;
      this.errorMsg = msg;
    },
    submitLogin() {
      this.$refs.usernameLoginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          login({
            userName: this.form.username,
            userPassword: this.form.password,
          }).then(res => {
            if (res.status == 0) {
              this.getUserInfo(res.data);
            } else {
              this.loading = false;
              this.showErrorMsg(res.msg);
            }
          });

        }
      });
    },
    //获取用户信息
    getUserInfo(res) {
      // 获取用户信息

      this.setStore("unicellularUserInfo", JSON.stringify(res));

      this.$store.commit("setAvatarPath", user_photo);

      // 加载菜单
      util.initRouter(this);

      //跳转至登录页或者上一个页面
      if(this.$route.query.redirect == 'lose'){
        this.$router.go(-1);
      }else {
        this.$router.push({
          path: "home"
        });
      }
    },
    register() {
      this.$router.push({
        path: "regist"
      });
    }
  },
  mounted() {

  }
};
</script>


