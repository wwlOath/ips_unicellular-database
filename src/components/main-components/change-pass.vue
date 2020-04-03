<template>
  <div class="change-pass-item">
    <div class="change-pass">
      <div class="password-content">
        <Form ref="editPasswordForm" :model="editPasswordForm" :label-width="150" label-position="right" :rules="passwordValidate" style="width:650px">
          <FormItem label="Password" prop="oldPassword">
            <Input type="password" v-model="editPasswordForm.oldPassword" placeholder="Please enter the password you are using now"></Input>
          </FormItem>
          <FormItem label="NewPassword" prop="newPassword">
            <Poptip trigger="focus" placement="right" width="250">
              <Input type="password" v-model="editPasswordForm.newPassword" @on-change="strengthChange" placeholder="Please enter a new password, 6-20 characters long"></Input>
              <div :class="tipStyle" slot="content">
                <span class="words">Strength : {{strength}}</span>
                <Slider v-model="strengthValue" :step="33" style="width:95%"></Slider>
                Please enter at least 6 <br>
                characters. Please do not use a <br> password that is easy to guess.
              </div>
            </Poptip>
          </FormItem>
          <FormItem label="CheckPassword" prop="checkPassword">
            <Input type="password" v-model="editPasswordForm.checkPassword" placeholder="Please enter the new password again"></Input>
          </FormItem>
          <FormItem>
            <Button type="primary" style="width: 100px;margin-right:5px" :loading="savePassLoading" @click="saveEditPass">Save</Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<style lang="less">
  .change-pass-item {
    padding: 8px 40px;
  /*.content-info {
    min-height: calc(100vh - 260px);
  }*/
  .change-pass {
  .password-content {
    padding: 0 20px;
  }
  .ivu-poptip {
    display: inline-block;
    width: 100%;
  }
  .ivu-poptip-rel {
    width: 100%;
    display: inline-block;
    position: relative;
  }
  .ivu-slider-button {
    display: none;
  }
  .ivu-slider-button-wrap .ivu-tooltip {
    display: none;
  }
  .password-tip-none {
    padding: 1vh 0;
    font-size: 14px;
  .ivu-slider-bar {
    height: 4px;
    border-radius: 3px;
    position: absolute;
  }
  }
  .password-tip-weak {
    padding: 1vh 0;
    font-size: 14px;
  .words {
    color: #ed3f14;
  }
  .ivu-slider-bar {
    height: 4px;
    background: #ed3f14;
    border-radius: 3px;
    position: absolute;
  }
  }
  .password-tip-middle {
    padding: 1vh 0;
    font-size: 14px;
  .words {
    color: #faad14;
  }
  .ivu-slider-bar {
    height: 4px;
    background: #faad14;
    border-radius: 3px;
    position: absolute;
  }
  }
  .password-tip-strong {
    padding: 1vh 0;
    font-size: 14px;
  .words {
    color: #52c41a;
  }
  .ivu-slider-bar {
    height: 4px;
    background: #52c41a;
    border-radius: 3px;
    position: absolute;
  }
  }
  &-btn-box {
     margin-bottom: 10px;
  button {
    padding-left: 0;
  span {
    color: #2D8CF0;
    transition: all .2s;
  }
  span:hover {
    color: #0C25F1;
    transition: all .2s;
  }
  }
  }
  }
  }
</style>

<script>
  import { changePass } from "@/api/user";
  import {mapActions} from "vuex";

  export default {
    name: "change_pass",
    data() {
      const valideRePassword = (rule, value, callback) => {
        if (value !== this.editPasswordForm.newPassword) {
          callback(new Error("The two passwords are inconsistent"));
        } else {
          callback();
        }
      };
      return {
        savePassLoading: false,
        tipStyle: "password-tip-none",
        strength: "nothing",
        strengthValue: 0,
        editPasswordForm: {
          oldPassword: "",
          newPassword: "",
          checkPassword: ""
        },
        passwordValidate: {
          oldPassword: [
            {
              required: true,
              message: "Please enter the original password",
              trigger: "blur"
            }
          ],
          newPassword: [
            {
              required: true,
              message: "Please enter a new password",
              trigger: "blur"
            },
            {
              min: 6,
              message: "Please enter at least 6 characters",
              trigger: "blur"
            },
            {
              max: 32,
              message: "Enter up to 32 characters",
              trigger: "blur"
            }
          ],
          checkPassword: [
            {
              required: true,
              message: "Please enter the new password again",
              trigger: "blur"
            },
            {
              validator: valideRePassword,
              trigger: "blur"
            }
          ]
        }
      };
    },
    methods: {
      ...mapActions("user",["logout"]),
      init() {},
      checkStrengthValue(v) {
        // 评级制判断密码强度 最高5
        let grade = 0;
        if (/\d/.test(v)) {
          grade++; //数字
        }
        if (/[a-z]/.test(v)) {
          grade++; //小写
        }
        if (/[A-Z]/.test(v)) {
          grade++; //大写
        }
        if (/\W/.test(v)) {
          grade++; //特殊字符
        }
        if (v.length >= 10) {
          grade++;
        }
        return grade;
      },
      strengthChange() {
        if (!this.editPasswordForm.newPassword) {
          this.tipStyle = "password-tip-none";
          this.strength = "nothing";
          this.strengthValue = 0;
          return;
        }
        let grade = this.checkStrengthValue(this.editPasswordForm.newPassword);
        if (grade <= 1) {
          this.tipStyle = "password-tip-weak";
          this.strength = "weak";
          this.strengthValue = 33;
        } else if (grade >= 2 && grade <= 4) {
          this.tipStyle = "password-tip-middle";
          this.strength = "middle";
          this.strengthValue = 66;
        } else {
          this.tipStyle = "password-tip-strong";
          this.strength = "strong";
          this.strengthValue = 100;
        }
      },
      saveEditPass() {
        let params = {
          oldPassword: this.editPasswordForm.oldPassword,
          newPassword: this.editPasswordForm.newPassword,
        };
        this.$refs["editPasswordForm"].validate(valid => {
          if (valid) {
            this.savePassLoading = true;
            changePass(params).then(res => {
              this.savePassLoading = false;
              if (res.status == '0') {
                this.$Modal.success({
                  title: "Password changed successfully",
                  content: "Password change succeeded, need to login again",
                  onOk: () => {
                    this.logout(this);
                    this.$router.push({
                      name: "login"
                    });
                  }
                });
              }
            });
          }
        });
      },
    },
    mounted() {}
  };
</script>
