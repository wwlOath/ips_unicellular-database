<template>
  <div class="own-space-info">
    <Card class="content-info">
      <Row>
        <Tabs value="account">
          <TabPane label="Account" name="account">
            <div class="project-item-tab">
              <div class="project-view-con">
                <div class="message-view-header">
                  <Form
                    ref="userForm"
                    :model="userForm"
                    :label-width="150"
                    label-position="right"
                    :rules="userMessageValidate"
                  >
                    <FormItem label="Name：" prop="userName">
                      <p>{{userForm.userName}}</p>
                    </FormItem>
                    <FormItem label="Gender：" prop="userGender">
                      <Select v-model="userForm.userGender" class="user-input-style">
                        <Option value="male">male</Option>
                        <Option value="female">female</Option>
                        <Option value="other">other</Option>
                      </Select>
                    </FormItem>
                    <FormItem label="Email：" prop="userEmail">
                      {{userForm.userEmail}}
                    </FormItem>
                    <FormItem label="Telephone：" prop="userTelephone">
                      <Input v-model="userForm.userTelephone" placeholder="telephone" class="user-input-style"></Input>
                    </FormItem>
                    <FormItem label="Organization：" prop="organization">
                      <Input v-model="userForm.organization" placeholder="organization" class="user-input-style"></Input>
                    </FormItem>
                    <FormItem label="Description：" prop="userDesc">
                      <Input type="textarea" :rows="5" v-model="userForm.userDesc" placeholder="description" class="user-input-style"></Input>
                    </FormItem>

                    <FormItem>
                      <Button type="primary" style="width: 100px;margin-right:5px" :loading="saveLoading" @click="saveEdit">Save</Button>
                    </FormItem>
                  </Form>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane label="Security" name="security">
            <changePassword></changePassword>
          </TabPane>
        </Tabs>
      </Row>
    </Card>
  </div>
</template>

<style lang="less">
  .own-space-info {
    .content-info {
      min-height: calc(~'100vh - 130px');
    }
    .project-item-tab {
      padding: 0 15px;
      display: flex;

      .project-view-con {
        padding: 8px 40px;
        width: 100%;
        overflow: auto;

        .user-input-style {
          width: 650px;
        }
      }
    }
  }
</style>

<script>
  import {
    userInfoSave
  } from "@/api/user";
  import changePassword from './change-pass';

  export default {
    name: 'ownspace',
    data(){
      const validePhone = (rule, value, callback) => {
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
      return {
        Authorization: {},
        userForm: {

        },
        saveLoading: false,
        userMessageValidate: {
          userName: [
            { required: true, message: 'The username cannot be empty', trigger: 'blur' }
          ],
          userTelephone: [
            { required: false, validator: validePhone, trigger: 'blur' }
          ],
          userEmail: [
            { required: true, message: "Please enter email address" },
            { type: "email", message: "Incorrect mailbox format" }
          ],
          organization: [
            { required: true, message: 'The organization cannot be empty', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      changePassword
    },
    methods: {
      init(){
        let v = JSON.parse( this.getStore("dbUserInfo"));
        // 转换null为""
        for (let attr in v) {
          if (v[attr] === null) {
            v[attr] = "";
          }
        }
        let str = JSON.stringify(v);
        let userInfo = JSON.parse(str);
        this.userForm = userInfo;
      },
      saveEdit() {
        this.$refs["userForm"].validate(valid => {
          if (valid) {
            this.saveLoading = true;
            userInfoSave(this.userForm).then(res => {
              this.saveLoading = false;
              if (res.status == '0') {
                this.$Message.success("Success");
                //this.reloadRefreshData();
                // 更新用户信息
                this.setStore("dbUserInfo",  this.userForm);
              }else{
                this.$Message.error(res.msg);
              }
            });
          }
        });
      }
    },
    mounted() {
      this.init();
    }
  };
</script>

