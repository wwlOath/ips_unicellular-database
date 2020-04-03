<template>
  <div class="regist-container">
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
        <div class="content-style-top">
          <div class="content">
            <Row type="flex" justify="center" align="middle" class="login" @keydown.enter.native="submitLogin">
              <Col :lg="{span:8}" :md="{span:18}" :sm="{span:18}" :xs="{span:22}" class="col-content">
                <Card :bordered="false">

                  <Row type="flex" justify="center" align="middle">
                    <Col span="22">
                      <Row>
                        <div class="login-title-item login-right">
                          <h3 class="title">Register</h3>
                        </div>
                      </Row>

                      <Alert type="error" show-icon v-if="error">{{errorMsg}}</Alert>

                      <Row class="login-form">
                        <Row>
                          <Form ref="usernameLoginForm" :model="form" :rules="rules" class="form" :label-width="120">
                            <FormItem label="Name" prop="userName">
                              <Input v-model="form.userName" placeholder="username"/>
                            </FormItem>
                            <FormItem label="RealName" prop="realName">
                              <Input v-model="form.realName" placeholder="realName"/>
                            </FormItem>
                            <FormItem label="Gender" prop="userGender">
                              <Select v-model="form.userGender">
                                <Option value="male" key="male">male</Option>
                                <Option value="female" key="female">female</Option>
                                <Option value="other" key="other">other</Option>
                              </Select>
                            </FormItem>
                            <FormItem label="Password" prop="userPassword">
                              <Input type="password" v-model="form.userPassword" placeholder="userPassword"/>
                            </FormItem>
                            <FormItem label="Email" prop="userEmail">
                              <Input v-model="form.userEmail" placeholder="userEmail"/>
                            </FormItem>
                            <FormItem label="Telephone" prop="userTelephone">
                              <Input v-model="form.userTelephone" placeholder="userTelephone"/>
                            </FormItem>
                            <FormItem label="Organization" prop="organization">
                              <Input v-model="form.organization" placeholder="organization"/>
                            </FormItem>
                            <FormItem label="Description" prop="userDesc">
                              <Input type="textarea" :rows="3" v-model="form.userDesc" placeholder="userDesc"/>
                            </FormItem>
                          </Form>
                        </Row>

                        <Row>
                          <Button class="login-btn" type="primary" size="large" :loading="loading" @click="submitLogin" long>
                            <span v-if="!loading">Register</span>
                            <span v-else>Registering...</span>
                          </Button>
                        </Row>

                        <Row type="flex" justify="space-between" class="code-row-bg other-login">
                          <div class="other-way icons"></div>
                          <router-link to="/login"><a class="forget-pass">User logged in</a></router-link>
                        </Row>
                      </Row>
                    </Col>

                  </Row>

                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </Content>

      <Footer class="layout-footer-center">
        Copyright © 2018 <a href="http://www.myhealthgene.com/" target="_blank">万康源（天津）基因科技有限公司</a> All
        Rights Reserved
      </Footer>
    </Layout>

  </div>
</template>

<style lang="less">
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
  .regist-container {
    .content {
      .login {
        height: 100vh;
        .header {
        margin-top: 4vh;
        margin-bottom: 1vh;
        text-align: center;
      }

      .login-right {
        text-align: center;
      }

      .login-title-item {
        .title {
          font-size: 24px;
          text-align: center;
          margin: 30px auto 20px;
        }
      }

      .col-content {
        width: 550px;
      }

      .login-form {
        margin-bottom: 2vh;
      }
      .form {
        padding-top: 1vh;
      }
      .forget-pass,
        .other-way {
          font-size: 14px;
        }
        .login-btn,
          .other-login {
            margin-top: 3vh;
          }
          .icons {
            display: flex;
            align-items: center;
          }
          .ivu-card{
            box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
          }
        }
      }
    }
</style>

<script>

  import {
    registUser,
    isEffectiveName,
    isEffectiveEmail
  } from "@/api/user";

  export default {
    name: 'regist',
    data() {
      const validatePhone = (rule, value, callback) => {
        if(value != ''){
          let reg = /^[1][3,4,5,6,7,8][0-9]{9}$/;
          if (!reg.test(value)) {
            callback(new Error("Please enter a phone number in the correct format"));
          } else {
            callback();
          }
        }else{
          return true;
        }

      };

      const validateName = (rule,value,callback) => {
        isEffectiveName({
          userName: this.form.userName
        }).then(res => {
          if(res.msg == 'User name available!'){
            callback();
          }else{
            callback(new Error(res.msg))
          }
        }).catch(error => {
          callback(new Error(res.msg))
        })
      };

      const validateEmail = (rule,value,callback) => {
        isEffectiveEmail({
          email: this.form.userEmail
        }).then(res => {
          if(res.msg == 'Email available!'){
            callback();
          }else{
            callback(new Error(res.msg))
          }
        }).catch(error => {
          callback(new Error(res.msg))
        })
      };

      return {
        iconSize: 20,
        isUpdateData: true,
        avatarPathImg: '',
        isCurrentAlive: true,
        error: false,
        errorMsg: "",
        saveLogin: true,
        loading: false,
        form: {
          userGender: 'male',
          userTelephone: ''
        },
        rules: {
          userName: [
            { required: true, message: 'The name cannot be empty', trigger: 'blur'},
            {validator: validateName, trigger: 'blur' }
          ],
          realName: [
            { required: true, message: 'The name cannot be empty', trigger: 'blur' }
          ],
          userPassword: [
            { required: true, message: 'The password cannot be empty', trigger: 'blur' },
            { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
          ],
          userEmail: [
            { required: true, message: "Please enter email address" },
            { type: "email", message: "Incorrect mailbox format" },
            {validator: validateEmail, trigger: 'blur' }
          ],
          userTelephone: [
            { required: false, trigger:'blur'},
            {validator: validatePhone, trigger: 'blur' }
          ],
          organization: [
            {required: true, message: "The organization cannot be empty", trigger: "blur"}
          ],
        },
      };
    },
    computed: {
      avatarPath() {
        return localStorage.avatorImgPath;
      },
    },
    methods: {
      itemTitle(item) {
        if (typeof item.name === "object") {
          return this.$t(item.name.i18n);
        } else {
          return item.name;
        }
      },
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

            registUser(this.form).then(res => {
              if (res.status == '0') {
                this.loading = false;
                this.$Message.success(res.msg);
                this.$router.push('/login');
              } else {
                this.loading = false;
                this.showErrorMsg(res.msg);
              }
            });
          }
        });
      }
    },
    mounted() {

    }
  };
</script>
